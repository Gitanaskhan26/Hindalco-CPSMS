export interface Employee {
  id: string; // Employee Code
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl: string;
  avatarHint: string;
}

export const mockEmployees: Employee[] = [
  {
    id: '12345',
    dob: '1990-01-15',
    name: 'Ramesh Kumar',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
  },
  {
    id: '67890',
    dob: '1985-05-20',
    name: 'Sunita Sharma',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait',
  },
];

// Mock function to simulate fetching from a database
export const fetchEmployeeDetails = async (employeeCode: string, dob: string): Promise<Employee | null> => {
  // In a real app, this would be an API call to Oracle APEX
  const employee = mockEmployees.find(emp => emp.id === employeeCode && emp.dob === dob);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (employee) {
    return employee;
  }
  
  return null;
};
