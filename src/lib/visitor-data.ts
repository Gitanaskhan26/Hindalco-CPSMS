
import type { Visitor, VisitorRequest, VisitorRequestStatus } from './types';
import { unstable_noStore as noStore } from 'next/cache';

const initialMockVisitors: Omit<Visitor, 'type'>[] = [
  {
    id: 'V-98765',
    dob: '1988-11-22',
    name: 'Amit Singh',
    avatarHint: 'man portrait glasses',
    entryTime: new Date().toISOString(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Valid for 7 days
    lat: 24.2085,
    lng: 83.0416,
  },
  {
    id: 'V-12345',
    dob: '1995-03-10',
    name: 'Priya Patel',
    avatarHint: 'woman portrait smiling',
    entryTime: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), // Entered 2 hours ago
    validUntil: new Date(new Date().setHours(new Date().getHours() + 6)).toISOString(), // Valid for 8 hours total
    lat: 24.2015,
    lng: 83.0381,
  },
  // Anas Khalid is now a pre-existing active visitor because his request was approved in the past.
  {
    id: 'V-AK2024',
    dob: '1994-06-20',
    name: 'Anas Khalid',
    avatarHint: 'man portrait young professional',
    entryTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Assumed entry 1 day ago
    validUntil: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Valid for 1 more day
    lat: 24.2055,
    lng: 83.0401,
  },
];

const initialMockVisitorRequests: VisitorRequest[] = [
    // This is the new, pending request that should appear for the employee.
    {
        id: 'VREQ-003',
        visitorName: 'Pranav Sharma',
        visitorDob: '1992-07-18',
        purpose: 'Vendor meeting for new machinery.',
        employeeToVisitId: '12345', // Ramesh Kumar
        employeeToVisitName: 'Ramesh Kumar',
        requestedBy: '56789', // Geeta Joshi (Security)
        status: 'Pending',
        timestamp: new Date().toISOString(),
        statusHistory: [{
          status: 'Requested',
          timestamp: new Date().toISOString(),
          updatedBy: 'Geeta Joshi',
          updatedById: '56789'
        }],
    },
    // This is a historical, approved request.
    {
        id: 'VREQ-002',
        visitorName: 'Anas Khalid',
        visitorDob: '1994-06-20',
        purpose: 'Training Employee for the new conveyor belt',
        employeeToVisitId: '78901',
        employeeToVisitName: 'Kavita Nair',
        requestedBy: '11223',
        status: 'Approved',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        statusHistory: [
          { status: 'Requested', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), updatedBy: 'Anil Mehta', updatedById: '11223' },
          { status: 'Approved', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), updatedBy: 'Kavita Nair', updatedById: '78901' },
        ],
        generatedVisitorId: 'V-AK2024',
    }
];


// --- Global Caching for Development ---
// This ensures our mock database persists across hot reloads in dev mode.
var globalForVisitors = global as unknown as {
  mockVisitors: Omit<Visitor, 'type'>[] | undefined;
  mockVisitorRequests: VisitorRequest[] | undefined;
};

// If global data doesn't exist, initialize it with a deep copy of the static data.
if (!globalForVisitors.mockVisitors) {
    globalForVisitors.mockVisitors = JSON.parse(JSON.stringify(initialMockVisitors));
}
if (!globalForVisitors.mockVisitorRequests) {
    globalForVisitors.mockVisitorRequests = JSON.parse(JSON.stringify(initialMockVisitorRequests));
}

// All functions will now use these global arrays, which act as our persistent mock DB.
export let mockVisitors: Omit<Visitor, 'type'>[] = globalForVisitors.mockVisitors;
export let mockVisitorRequests: VisitorRequest[] = globalForVisitors.mockVisitorRequests;


// --- Data Mutation Functions for Requests ---

export const addVisitorRequest = async (request: Omit<VisitorRequest, 'id' | 'timestamp' | 'statusHistory'>, requester: { id: string, name: string }): Promise<VisitorRequest> => {
    noStore();
    const timestamp = new Date().toISOString();
    const newRequest: VisitorRequest = {
        ...request,
        id: `VREQ-${(mockVisitorRequests.length + 1 + Math.random()).toString().padStart(3, '0')}`,
        timestamp: timestamp,
        statusHistory: [{
            status: 'Requested',
            timestamp: timestamp,
            updatedBy: requester.name,
            updatedById: requester.id
        }],
    };
    mockVisitorRequests.unshift(newRequest);
    return newRequest;
};


export const findVisitorRequestById = async (id: string): Promise<VisitorRequest | undefined> => {
    noStore();
    const request = mockVisitorRequests.find(req => req.id === id);
    return request ? JSON.parse(JSON.stringify(request)) : undefined;
};

export const updateVisitorRequestStatus = async (id: string, status: VisitorRequestStatus, updatedById: string, updatedByName: string): Promise<VisitorRequest | undefined> => {
    noStore();
    const requestIndex = mockVisitorRequests.findIndex(req => req.id === id);
    if (requestIndex > -1) {
        mockVisitorRequests[requestIndex].status = status;
        mockVisitorRequests[requestIndex].statusHistory.push({
            status: status,
            timestamp: new Date().toISOString(),
            updatedBy: updatedByName,
            updatedById: updatedById,
        });
        return mockVisitorRequests[requestIndex];
    }
    return undefined;
};

export const updateVisitorRequestWithVisitorId = async (requestId: string, visitorId: string): Promise<VisitorRequest | undefined> => {
    noStore();
    const requestIndex = mockVisitorRequests.findIndex(req => req.id === requestId);
    if (requestIndex > -1) {
        mockVisitorRequests[requestIndex].generatedVisitorId = visitorId;
        return mockVisitorRequests[requestIndex];
    }
    return undefined;
};


// --- Data Mutation Functions for Visitors ---

export const addVisitor = async (details: { name: string, dob: string }): Promise<Visitor> => {
    noStore();
    const plantLat = 24.2045;
    const plantLng = 83.0396;
    const newVisitor: Visitor = {
        id: `V-${details.name.slice(0,2).toUpperCase()}${Date.now().toString().slice(-6)}`,
        dob: details.dob,
        name: details.name,
        avatarHint: 'person portrait',
        entryTime: new Date().toISOString(),
        validUntil: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Valid for 1 day
        type: 'visitor',
        lat: plantLat + (Math.random() - 0.5) * 0.01,
        lng: plantLng + (Math.random() - 0.5) * 0.01,
    };
    const { type, ...visitorToAdd } = newVisitor;
    mockVisitors.unshift(visitorToAdd);
    return newVisitor;
};


// --- Data Fetching Functions ---

// Mock function to simulate fetching from a database
export const fetchVisitorDetails = async (visitorId: string, dob: string): Promise<Visitor | null> => {
  noStore();
  // In a real app, this would be an API call to Oracle APEX
  const visitor = mockVisitors.find(vis => vis.id === visitorId && vis.dob === dob);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (visitor) {
    return { ...visitor, type: 'visitor' };
  }
  
  return null;
};

// Mock function for employees to fetch all active visitors
export const fetchAllVisitors = async (): Promise<Visitor[]> => {
    noStore();
    await new Promise(resolve => setTimeout(resolve, 200)); // simulate network delay
    const allVisitors = mockVisitors.map(v => ({ ...v, type: 'visitor' as const }));
    return allVisitors;
}


export const findVisitorById = async (id: string): Promise<Visitor | null> => {
    noStore();
    const visitor = mockVisitors.find(vis => vis.id === id);
    if (visitor) {
      return { ...visitor, type: 'visitor' };
    }
    return null;
}
