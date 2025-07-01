
'use server';

import { unstable_noStore as noStore } from 'next/cache';
import type { Notification } from './types';
import { initialPermits } from './data';
import { mockEmployees } from './employee-data';

let mockNotifications: Notification[] = [
    // Notification for Ramesh Kumar (12345) to approve Pranav Sharma's request
    {
        id: 'NOTIF-007',
        recipientId: '12345', // Ramesh Kumar
        type: 'visitor_request',
        title: 'Visitor Pass Request',
        description: 'Pranav Sharma is requesting a pass to visit you for "Vendor meeting for new machinery."',
        isRead: false,
        timestamp: new Date().toISOString(),
        payload: { visitorRequestId: 'VREQ-003' },
    },
    // Historical notification for Security Head (11223) about Anas Khalid's approval
     {
        id: 'NOTIF-008',
        recipientId: '11223', // Anil Mehta (Security Head)
        type: 'permit_status_update',
        title: 'Visitor Request Approved',
        description: 'The request for visitor "Anas Khalid" was Approved by Kavita Nair. Visitor ID: V-AK2024.',
        isRead: true, // Mark as read since it's a historical/informational record
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        payload: { visitorRequestId: 'VREQ-002' },
    },
    {
        id: 'NOTIF-002',
        recipientId: '67890', // Sunita Sharma (Safety Officer)
        type: 'permit_approval',
        title: 'High-Risk Permit Review',
        description: 'Permit #PERMIT-004 requires your approval.',
        isRead: false,
        timestamp: new Date(new Date().setHours(new Date().getHours()-1)).toISOString(),
        payload: { permitId: 'PERMIT-004' },
    },
    {
        id: 'NOTIF-004',
        recipientId: '45678', // Vikram Rathod (Safety Inspector)
        type: 'permit_approval',
        title: 'High-Risk Permit Review',
        description: 'Permit #PERMIT-004 requires your approval.',
        isRead: true,
        timestamp: new Date(new Date().setHours(new Date().getHours()-1)).toISOString(),
        payload: { permitId: 'PERMIT-004' },
    },
    {
        id: 'NOTIF-005',
        recipientId: '67890', // Sunita Sharma (Safety Officer)
        type: 'permit_approval',
        title: 'High-Risk Permit Review',
        description: 'Permit #PERMIT-005 needs review.',
        isRead: false,
        timestamp: new Date(new Date().setHours(new Date().getHours()-2)).toISOString(),
        payload: { permitId: 'PERMIT-005' },
    },
    {
        id: 'NOTIF-003',
        recipientId: '11223', // Anil Mehta (Security Head)
        type: 'permit_status_update',
        title: 'Permit Approved',
        description: 'Permit #PERMIT-001 has been approved by Sunita Sharma.',
        isRead: true,
        timestamp: new Date(new Date().setHours(new Date().getHours()-3)).toISOString(),
        payload: { permitId: 'PERMIT-001', status: 'Approved' },
    },
];

// --- Data Fetching Functions ---

export const fetchNotificationsForUser = async (userId: string): Promise<Notification[]> => {
    noStore();
    // In a real app, this would also join with permit/visitor data.
    return mockNotifications
        .filter(n => n.recipientId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// --- Data Mutation Functions ---

export const addNotification = async (notification: Omit<Notification, 'id'>) => {
    noStore();
    const newId = `NOTIF-${(mockNotifications.length + 1 + Math.random()).toString().padStart(3, '0')}`;
    const newNotification: Notification = { ...notification, id: newId };
    mockNotifications = [newNotification, ...mockNotifications];
    return newNotification;
};

export const removeNotification = async (id: string): Promise<void> => {
    noStore();
    mockNotifications = mockNotifications.filter(n => n.id !== id);
};
