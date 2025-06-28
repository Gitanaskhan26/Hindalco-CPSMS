import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { HindalcoHeader } from '@/components/hindalco-header';
import { HindalcoFooter } from '@/components/hindalco-footer';


export const metadata: Metadata = {
  title: 'Hindalco C-PSMS MVP',
  description: 'Digital Permit-to-Work System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <div className="relative flex flex-col min-h-screen bg-background">
          <HindalcoHeader />
          <main className="flex-grow pb-20 md:pb-0">
            {children}
          </main>
          <HindalcoFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
