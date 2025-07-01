
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { createPermit } from '@/lib/actions';
import { useUser } from '@/context/user-context';
import { useRefresh } from '@/context/refresh-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PermitFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  ppeChecklist: z.string().min(5, {
    message: 'PPE checklist must be at least 5 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function PermitForm({
  isOpen,
  onOpenChange,
}: PermitFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const { triggerRefresh } = useRefresh();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      ppeChecklist: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user || user.type !== 'employee') {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in as an employee to create a permit.',
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('description', values.description);
    formData.append('ppeChecklist', values.ppeChecklist);
    formData.append('userId', user.id);
    formData.append('userName', user.name);

    try {
      const result = await createPermit(formData);

      if (result.permit) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        triggerRefresh();
        onOpenChange(false);
      } else if (result.errors) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: result.message,
        });
        for (const [key, value] of Object.entries(result.errors)) {
          if (value) {
            form.setError(key as keyof FormValues, { type: 'server', message: value[0] });
          }
        }
      } else {
         toast({
          variant: 'destructive',
          title: 'An Error Occurred',
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Permit submission failed', error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'An unexpected error occurred while creating the permit.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Permit</DialogTitle>
          <DialogDescription>
            Fill in the details below. A location will be assigned within the plant.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Welding on pipe rack at level 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ppeChecklist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required PPE</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Helmet, Gloves, Safety Goggles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assessing Risk...
                  </>
                ) : (
                  'Create and Assess Risk'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
