'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Menu, Map, FileText, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/icons';

export const HindalcoHeader = () => {
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Permits', href: '/permits', icon: FileText },
    { label: 'Plant Map', href: '/map', icon: Map },
  ];

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/80">
                  <Menu className="text-primary-foreground" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 p-4">
                  <Link 
                    href="/"
                    className="flex items-center cursor-pointer mb-4"
                  >
                    <Logo className="h-10 w-10"/>
                    <h1 className="text-xl font-bold ml-2 text-primary">C-PSMS</h1>
                  </Link>
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="justify-start text-base"
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center cursor-pointer">
            <Logo className="h-10 w-10"/>
            <h1 className="text-xl font-bold ml-2 hidden sm:block">C-PSMS</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map(item => (
             <Button
                key={item.label}
                variant="ghost"
                className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
                onClick={() => router.push(item.href)}
              >
                {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hover:bg-primary/80">
            <Bell className="text-primary-foreground" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="cursor-pointer">
             <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="user avatar" />
             <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
