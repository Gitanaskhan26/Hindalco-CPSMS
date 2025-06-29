'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/context/user-context';
import { HindalcoHeader } from '@/components/hindalco-header';
import { HindalcoFooter } from '@/components/hindalco-footer';
import { Skeleton } from '@/components/ui/skeleton';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until user state is loaded from localStorage
    }

    const isAuthPage = pathname === '/login';

    if (user && isAuthPage) {
      router.push('/'); // If logged in, redirect from login page to home
    } else if (!user && !isAuthPage) {
      router.push('/login'); // If not logged in, redirect from any other page to login
    }
  }, [user, isLoading, pathname, router]);

  const noLayoutPages = ['/login'];

  if (noLayoutPages.includes(pathname)) {
    return <>{children}</>;
  }

  // Show a loading skeleton for the main layout while we check auth
  if (isLoading || !user) {
    return (
        <div className="relative flex flex-col min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground p-4 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-6 w-24 hidden md:block" />
                    </div>
                     <div className="hidden md:flex items-center space-x-1">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                     </div>
                     <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                     </div>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center">
            </main>
        </div>
    );
  }


  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <HindalcoHeader />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <HindalcoFooter />
    </div>
  );
}
