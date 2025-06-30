import type { Employee } from './types';

// Omit 'type' as it will be added by the fetch function
export const mockEmployees: Omit<Employee, 'type'>[] = [
  {
    id: '12345',
    dob: '1990-01-15',
    name: 'Ramesh Kumar',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
    department: 'Maintenance',
    designation: 'Lead Engineer',
  },
  {
    id: '67890',
    dob: '1985-05-20',
    name: 'Sunita Sharma',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait',
    department: 'Safety',
    designation: 'Safety Officer',
  },
  {
    id: '11223',
    dob: '1982-08-01',
    name: 'Anil Mehta',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait security',
    department: 'Security',
    designation: 'Head of Security',
  },
    {
    id: '44556',
    dob: '1992-03-30',
    name: 'Pooja Desai',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait professional',
    department: 'Production',
    designation: 'Shift Supervisor',
  },
];

// Mock function to simulate fetching from a database
export const fetchEmployeeDetails = async (employeeCode: string, dob: string): Promise<Employee | null> => {
  // In a real app, this would be an API call to Oracle APEX
  const employee = mockEmployees.find(emp => emp.id === employeeCode && emp.dob === dob);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (employee) {
    return { ...employee, type: 'employee' };
  }
  
  return null;
};
