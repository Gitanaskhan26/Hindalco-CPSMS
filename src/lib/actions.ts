'use server';

import { z } from 'zod';
import { assessPermitRisk } from '@/ai/flows/assess-permit-risk';
import type { Permit } from './types';

const permitSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  ppeChecklist: z.string().min(5, 'PPE checklist must be at least 5 characters.'),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

type FormState = {
  message: string;
  errors?: {
    description?: string[];
    ppeChecklist?: string[];
    lat?: string[];
    lng?: string[];
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
    lat: formData.get('lat'),
    lng: formData.get('lng'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please check your input. Location is required.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { description, ppeChecklist, lat, lng } = validatedFields.data;
    const assessment = await assessPermitRisk({ description, ppeChecklist });

    const id = crypto.randomUUID();
    const riskLevel = assessment.riskLevel;
    
    const permitData = JSON.stringify({ id, risk: riskLevel });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      permitData
    )}`;
    
    const newPermit: Permit = {
      id,
      description,
      ppeChecklist,
      ...assessment,
      status: 'Approved',
      lat,
      lng,
      qrCodeUrl,
    };

    return { message: 'Permit created successfully.', permit: newPermit };
  } catch (error) {
    console.error('Error creating permit:', error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
}
