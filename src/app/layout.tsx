import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AppWrapper } from '@/components/app-wrapper';
import { UserProvider } from '@/context/user-context';
import { NotificationProvider } from '@/context/notification-context';
import { RefreshProvider } from '@/context/refresh-context';


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
        <UserProvider>
          <RefreshProvider>
            <NotificationProvider>
              <AppWrapper>{children}</AppWrapper>
              <Toaster />
            </NotificationProvider>
          </RefreshProvider>
        </UserProvider>
      </body>
    </html>
  );
}
