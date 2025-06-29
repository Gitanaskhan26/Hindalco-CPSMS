'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { fetchEmployeeDetails, type Employee } from '@/lib/employee-data';

interface UserContextType {
  user: Employee | null;
  login: (employeeCode: string, dob: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<Employee | null>(null);
  const [isLoading, setIsLoading] = React.useState(true); // Start with loading true
  const router = useRouter();

  React.useEffect(() => {
    // Check local storage for saved user on initial load
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeCode: string, dob: string): Promise<boolean> => {
    setIsLoading(true);
    const employee = await fetchEmployeeDetails(employeeCode, dob);
    if (employee) {
      setUser(employee);
      localStorage.setItem('user', JSON.stringify(employee));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
