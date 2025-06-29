'use client';

export interface Visitor {
  id: string; // Visitor ID
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl: string;
  avatarHint: string;
  entryTime: string; // ISO 8601 string
  validUntil: string; // ISO 8601 string
  type: 'visitor';
}

export const mockVisitors: Omit<Visitor, 'type'>[] = [
  {
    id: 'V-98765',
    dob: '1988-11-22',
    name: 'Amit Singh',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'man portrait glasses',
    entryTime: new Date().toISOString(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Valid for 7 days
  },
  {
    id: 'V-12345',
    dob: '1995-03-10',
    name: 'Priya Patel',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'woman portrait smiling',
    entryTime: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), // Entered 2 hours ago
    validUntil: new Date(new Date().setHours(new Date().getHours() + 6)).toISOString(), // Valid for 8 hours total
  },
];

// Mock function to simulate fetching from a database
export const fetchVisitorDetails = async (visitorId: string, dob: string): Promise<Visitor | null> => {
  // In a real app, this would be an API call to Oracle APEX
  const visitor = mockVisitors.find(vis => vis.id === visitorId && vis.dob === dob);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (visitor) {
    return { ...visitor, type: 'visitor' };
  }
  
  return null;
};
