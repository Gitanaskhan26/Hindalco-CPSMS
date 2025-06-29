'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled}>
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
  const [state, formAction] = React.useActionState(createPermit, { message: '' });
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      ppeChecklist: '',
    },
    errors: state?.errors,
  });

  React.useEffect(() => {
    if (isOpen) {
      setLocation(null);
      setLocationError(null);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location", error);
            const message = "Could not get location. Please enable location services and refresh.";
            setLocationError(message);
            toast({
                variant: 'destructive',
                title: 'Location Required',
                description: message,
            });
          }
        );
      } else {
        const message = "Geolocation is not supported by this browser.";
        setLocationError(message);
        toast({
            variant: 'destructive',
            title: 'Location Error',
            description: message,
        });
      }
    }
  }, [isOpen, toast]);

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
            Fill in the details below. Your current location will be tagged for mapping.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
             {location && (
              <>
                <input type="hidden" name="lat" value={location.lat} />
                <input type="hidden" name="lng" value={location.lng} />
              </>
            )}

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

            <div className="space-y-2">
              <FormLabel>Location Status</FormLabel>
               {locationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}
              {!location && !locationError && (
                <Alert>
                   <Loader2 className="h-4 w-4 animate-spin" />
                   <AlertTitle>Please Wait</AlertTitle>
                  <AlertDescription>
                    Fetching your current location...
                  </AlertDescription>
                </Alert>
              )}
              {location && (
                <Alert className="border-green-500/50 text-green-700 [&>svg]:text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Location captured successfully.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
              <SubmitButton disabled={!location} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
