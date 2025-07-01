
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { useToast } from '@/hooks/use-toast';
import { requestVisitorPass } from '@/lib/actions';
import { useUser } from '@/context/user-context';
import { useRefresh } from '@/context/refresh-context';
import { mockEmployees } from '@/lib/employee-data';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';

interface VisitorRequestFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const formSchema = z.object({
  visitorName: z.string().min(2, {
    message: 'Visitor name must be at least 2 characters.',
  }),
  visitorDob: z.date({
    required_error: "Visitor's date of birth is required.",
  }),
  purpose: z.string().min(1, {
    message: 'Purpose of visit cannot be empty.',
  }),
  employeeToVisitId: z.string().min(1, {
    message: "Please select an employee.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function VisitorRequestForm({
  isOpen,
  onOpenChange,
}: VisitorRequestFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const { triggerRefresh } = useRefresh();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitorName: '',
      purpose: '',
      employeeToVisitId: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user || user.type !== 'employee') {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to make a request.' });
        return;
    }

    setIsSubmitting(true);

    try {
      const result = await requestVisitorPass({
        ...values,
        visitorDob: format(values.visitorDob, 'yyyy-MM-dd'),
        requesterId: user.id,
      });

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        triggerRefresh();
        onOpenChange(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Request Failed',
          description: result.message,
        });
        if (result.errors) {
          for (const [key, value] of Object.entries(result.errors)) {
            if (value) {
              form.setError(key as keyof FormValues, { type: 'server', message: value[0] });
            }
          }
        }
      }
    } catch (error) {
      console.error('Visitor request submission failed', error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'An unexpected error occurred.',
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Visitor Pass</DialogTitle>
          <DialogDescription>
            Fill in the details to request an entry pass for a visitor. This will be sent for approval.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="visitorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visitor's Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visitorDob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Visitor's Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1930-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="employeeToVisitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee to Visit</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockEmployees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Visit</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Training for the new conveyor belt." {...field} />
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
                    Submitting...
                  </>
                ) : (
                  'Send Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
