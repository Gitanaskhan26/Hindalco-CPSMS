
'use server';

import { z } from 'zod';
import { assessPermitRisk } from '@/ai/flows/assess-permit-risk';
import type { Permit, Visitor, VisitorRequest } from './types';
import { addNotification, fetchNotificationsForUser, removeNotification } from './notification-data';
import { mockEmployees } from './employee-data';
import { initialPermits, findPermitById as findPermitByIdFromData, updatePermitStatus as updatePermitStatusInData } from './data';
import { addVisitor, addVisitorRequest, findVisitorRequestById, updateVisitorRequestStatus, fetchAllVisitors, updateVisitorRequestWithVisitorId, findVisitorById } from './visitor-data';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';

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

// Default location for new permits
const plantLat = 24.2045;
const plantLng = 83.0396;

export async function getPermits(): Promise<Permit[]> {
  noStore();
  // In a real app, this would fetch from a database.
  // We return a copy to ensure immutability against server-side mutations.
  return JSON.parse(JSON.stringify(initialPermits));
}

export async function getPermitById(id: string): Promise<Permit | null> {
    noStore();
    const permit = await findPermitByIdFromData(id);
    if (!permit) return null;
    return JSON.parse(JSON.stringify(permit));
}

export async function createPermit(formData: FormData): Promise<FormState> {
  noStore();
  
  const validatedFields = permitSchema.safeParse({
    description: formData.get('description'),
    ppeChecklist: formData.get('ppeChecklist'),
  });
  
  const userId = formData.get('userId') as string;
  const userName = formData.get('userName') as string;

  if (!userId || !userName) {
    return { message: 'User information is missing. Could not create permit.' };
  }

  if (!validatedFields.success) {
    return {
      message: 'Please check your input. All fields are required.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { description, ppeChecklist } = validatedFields.data;
    const assessment = await assessPermitRisk({ description, ppeChecklist });

    const id = `PERMIT-${Math.floor(Math.random() * 900) + 100}`;
    const riskLevel = assessment.riskLevel;
    
    const permitData = JSON.stringify({ id, risk: riskLevel });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      permitData
    )}`;
    
    const issueDate = new Date();
    const validUntil = new Date(issueDate.getTime() + 8 * 60 * 60 * 1000); // Default 8-hour validity

    const newPermit: Permit = {
      id,
      description,
      ppeChecklist,
      ...assessment,
      status: 'Pending',
      lat: plantLat + (Math.random() - 0.5) * 0.02,
      lng: plantLng + (Math.random() - 0.5) * 0.02,
      qrCodeUrl,
      issuedById: userId,
      issuedBy: userName,
      issueDate: issueDate.toISOString(),
      validUntil: validUntil.toISOString(),
      statusHistory: [{
        status: 'Created',
        timestamp: issueDate.toISOString(),
        updatedBy: userName,
      }],
    };
    
    initialPermits.unshift(newPermit);


    const safetyOfficers = mockEmployees.filter(e => e.department === 'Safety' || e.department === 'Fire and Safety');
    for (const officer of safetyOfficers) {
      await addNotification({
        recipientId: officer.id,
        type: 'permit_approval',
        title: `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk Permit Review`,
        description: `Permit #${newPermit.id.slice(0, 4)} from ${userName} requires approval.`,
        isRead: false,
        timestamp: new Date().toISOString(),
        payload: { permitId: newPermit.id },
      });
    }

    return { message: 'Permit created and sent for approval.', permit: newPermit };
  } catch (error) {
    console.error('Error creating permit:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    return { message: errorMessage };
  }
}

type ActionResponse = {
    success: boolean;
    message: string;
}

export async function handlePermitDecision(
  permitId: string,
  decision: 'Approved' | 'Rejected',
  approverId: string,
  approverName: string,
  notificationId: string
): Promise<ActionResponse> {
    noStore();
    try {
        const updatedPermit = await updatePermitStatusInData(permitId, decision, approverName);

        if (!updatedPermit) {
            return { success: false, message: 'Permit not found.' };
        }
        
        // Notify the original issuer
        await addNotification({
            recipientId: updatedPermit.issuedById,
            type: 'permit_status_update',
            title: `Permit #${permitId.slice(0, 4)} was ${decision}`,
            description: `Your permit for "${updatedPermit.description.slice(0,30)}..." was ${decision.toLowerCase()} by ${approverName}.`,
            isRead: false,
            timestamp: new Date().toISOString(),
            payload: { permitId },
        });
       
        // Notify all security personnel
        const securityPersonnel = mockEmployees.filter(e => e.department === 'Security');
        const description = `Permit #${updatedPermit.id.slice(0, 4)} for "${updatedPermit.description.slice(0, 30)}..." was ${decision.toLowerCase()} by ${approverName}.`;
        for (const guard of securityPersonnel) {
             await addNotification({
                recipientId: guard.id,
                type: 'permit_status_update',
                title: `Permit ${decision}: #${permitId.slice(0, 4)}`,
                description: description,
                isRead: false,
                timestamp: new Date().toISOString(),
                payload: { permitId },
            });
        }

        // Remove the notification from the approver's list
        await removeNotification(notificationId);
        
        revalidatePath('/', 'layout');
        return { success: true, message: `Permit has been ${decision}.` };

    } catch (error) {
        console.error("Error handling permit decision:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


const visitorRequestInputSchema = z.object({
  visitorName: z.string().min(2, { message: 'Visitor name must be at least 2 characters.' }),
  visitorDob: z.string().min(1, { message: "Date of birth is required." }),
  purpose: z.string().min(1, { message: 'Purpose of visit cannot be empty.' }),
  employeeToVisitId: z.string().min(1, { message: "Please select an employee.",
  }),
  requesterId: z.string(),
});
type VisitorRequestInput = z.infer<typeof visitorRequestInputSchema>;

type VisitorRequestFormState = {
  success: boolean;
  message: string;
  errors?: {
    visitorName?: string[];
    visitorDob?: string[];
    purpose?: string[];
    employeeToVisitId?: string[];
  };
};

export async function requestVisitorPass(input: VisitorRequestInput): Promise<VisitorRequestFormState> {
    noStore();
    const validatedFields = visitorRequestInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Please check your input. All fields are required.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    try {
        const { visitorName, visitorDob, purpose, employeeToVisitId, requesterId } = validatedFields.data;
        const employeeToNotify = mockEmployees.find(e => e.id === employeeToVisitId);
        const requester = mockEmployees.find(e => e.id === requesterId);

        if (!employeeToNotify || !requester) {
            return { success: false, message: 'Selected employee or requester could not be found.' };
        }

        const newRequest = await addVisitorRequest({
            visitorName,
            visitorDob,
            purpose,
            employeeToVisitId,
            employeeToVisitName: employeeToNotify.name,
            requestedBy: requesterId,
            status: 'Pending',
        }, {id: requester.id, name: requester.name});

        await addNotification({
            recipientId: employeeToNotify.id,
            type: 'visitor_request',
            title: 'Visitor Pass Request',
            description: `${visitorName} is requesting a pass to visit you. This was requested by ${requester.name} (Security).`,
            isRead: false,
            timestamp: new Date().toISOString(),
            payload: { visitorRequestId: newRequest.id },
        });

        return { success: true, message: `Visitor pass request for ${visitorName} has been sent for approval.` };

    } catch (error) {
        console.error('Visitor request submission failed', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function handleVisitorRequestDecision(
  requestId: string,
  decision: 'Approved' | 'Rejected',
  approverId: string,
  approverName: string,
  notificationId: string
): Promise<ActionResponse> {
    noStore();
    try {
        const request = await findVisitorRequestById(requestId);
        if (!request) {
            return { success: false, message: 'Visitor request not found.' };
        }

        const updatedRequest = await updateVisitorRequestStatus(requestId, decision, approverId, approverName);
        if (!updatedRequest) {
             return { success: false, message: 'Failed to update visitor request status.' };
        }

        let visitorIdNote = '';
        if (decision === 'Approved') {
            const newVisitor = await addVisitor({ name: request.visitorName, dob: request.visitorDob }); 
            await updateVisitorRequestWithVisitorId(requestId, newVisitor.id);
            visitorIdNote = ` The new Visitor ID is ${newVisitor.id}.`;
        }
        
        const securityPersonnel = mockEmployees.filter(e => e.department === 'Security');
        const description = `The request for visitor "${request.visitorName}" to see ${request.employeeToVisitName} has been ${decision.toLowerCase()} by ${approverName}.${visitorIdNote}`;
        
        for (const security of securityPersonnel) {
            await addNotification({
                recipientId: security.id,
                type: 'permit_status_update',
                title: `Visitor Request ${decision}`,
                description: description,
                isRead: false,
                timestamp: new Date().toISOString(),
                payload: { visitorRequestId: requestId },
            });
        }
       
        await removeNotification(notificationId);
        
        revalidatePath('/', 'layout');
        return { success: true, message: `Visitor request has been ${decision}.` };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error("Error handling visitor request decision:", error);
        return { success: false, message: errorMessage };
    }
}

export async function getActiveVisitors(): Promise<Visitor[]> {
    noStore();
    const allVisitors = await fetchAllVisitors();
    const activeVisitors = allVisitors.filter(v => new Date(v.validUntil) > new Date());
    return activeVisitors;
}


export async function getVisitorById(id: string): Promise<Visitor | null> {
    noStore();
    const visitor = await findVisitorById(id);
    return visitor;
}

export async function getVisitorRequestById(id: string): Promise<VisitorRequest | null> {
    noStore();
    const request = await findVisitorRequestById(id);
    if (!request) return null;
    // Return a deep copy to avoid module caching issues in dev
    return JSON.parse(JSON.stringify(request));
}
