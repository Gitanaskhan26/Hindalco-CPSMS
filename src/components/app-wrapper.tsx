'use client';

import { usePathname } from 'next/navigation';
import { HindalcoHeader } from '@/components/hindalco-header';
import { HindalcoFooter } from '@/components/hindalco-footer';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should not have the main header and footer
  const noLayoutPages = ['/login'];

  if (noLayoutPages.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <HindalcoHeader />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <HindalcoFooter />
    </div>
  );
}
