'use server';

import { z } from 'zod';
import { assessPermitRisk } from '@/ai/flows/assess-permit-risk';
import type { Permit } from './types';

const permitSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  ppeChecklist: z.string().min(5, 'PPE checklist must be at least 5 characters.'),
});

type FormState = {
  message: string;
  errors?: {
    description?: string[];
    ppeChecklist?: string[];
  };
  permit?: Permit;
};

export async function createPermit(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = permitSchema.safeParse({
    description: formData.get('description'),
    ppeChecklist: formData.get('ppeChecklist'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { description, ppeChecklist } = validatedFields.data;
    const assessment = await assessPermitRisk({ description, ppeChecklist });

    const newPermit: Permit = {
      id: new Date().toISOString(),
      description,
      ppeChecklist,
      ...assessment,
      // Mock location for demo purposes. In a real app, this would come from the user.
      lat: 22.5726 + (Math.random() - 0.5) * 0.1,
      lng: 88.3639 + (Math.random() - 0.5) * 0.1,
      get qrCodeUrl() {
        const permitData = JSON.stringify({ id: this.id, risk: this.riskLevel });
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          permitData
        )}`;
      },
    };

    return { message: 'Permit created successfully.', permit: newPermit };
  } catch (error) {
    console.error('Error creating permit:', error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
}
