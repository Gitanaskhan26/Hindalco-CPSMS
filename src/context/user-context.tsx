'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { fetchEmployeeDetails, type Employee } from '@/lib/employee-data';
import { fetchVisitorDetails, type Visitor } from '@/lib/visitor-data';
import { useToast } from '@/hooks/use-toast';

type AuthenticatedUser = Employee | Visitor;

interface UserContextType {
  user: AuthenticatedUser | null;
  login: (employeeCode: string, dob: string) => Promise<boolean>;
  loginVisitor: (visitorId: string, dob: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
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

  const loginVisitor = async (visitorId: string, dob: string): Promise<boolean> => {
    setIsLoading(true);
    const visitor = await fetchVisitorDetails(visitorId, dob);
    if (visitor) {
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          });

          const locatedVisitor: Visitor = {
            ...visitor,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUser(locatedVisitor);
          localStorage.setItem('user', JSON.stringify(locatedVisitor));
        } catch (error) {
          console.error("Could not get visitor location.", error);
          toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Please enable location permissions in your browser to capture your location.',
          });
          // Fallback to login without location
          setUser(visitor);
          localStorage.setItem('user', JSON.stringify(visitor));
        }
      } else {
        console.error("Geolocation is not supported by this browser.");
        toast({
          variant: 'destructive',
          title: 'Location Not Supported',
          description: 'Your browser does not support geolocation.',
        });
        // Fallback to login without location
        setUser(visitor);
        localStorage.setItem('user', JSON.stringify(visitor));
      }
      
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
    <UserContext.Provider value={{ user, login, loginVisitor, logout, isLoading }}>
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
