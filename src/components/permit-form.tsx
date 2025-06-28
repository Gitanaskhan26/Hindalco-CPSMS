'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createPermit } from '@/lib/actions';
import type { Permit } from '@/lib/types';
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
  onPermitCreated: (permit: Permit) => void;
}

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  ppeChecklist: z.string().min(5, {
    message: 'PPE checklist must be at least 5 characters.',
  }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Assessing Risk...
        </>
      ) : (
        'Create and Assess Risk'
      )}
    </Button>
  );
}

export function PermitForm({
  isOpen,
  onOpenChange,
  onPermitCreated,
}: PermitFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(createPermit, { message: '' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      ppeChecklist: '',
    },
    // Sync with useFormState
    errors: state?.errors,
  });

  React.useEffect(() => {
    if (state.message) {
      if (state.permit) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        onPermitCreated(state.permit);
        form.reset();
      } else if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: state.message,
        });
      }
    }
  }, [state, onPermitCreated, toast, form]);

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
            Fill in the details below. Our AI will assess the risk level.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
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
              <SubmitButton />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
