'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Bell,
  Menu,
  Map,
  FileText,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/icons';

export const HindalcoHeader = () => {
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Permits', href: '/permits', icon: FileText },
    { label: 'Plant Map', href: '/map', icon: Map },
  ];

  const notifications = [
    {
      title: 'Approval Request',
      description: 'Permit #PERMIT-004 needs your review.',
      time: '5m ago',
    },
    {
      title: 'Permit Approved',
      description: 'Your request for #PERMIT-006 has been approved.',
      time: '1h ago',
    },
    {
      title: 'High-Risk Alert',
      description: 'A new high-risk permit #PERMIT-001 was created.',
      time: '3h ago',
    },
     {
      title: 'Safety Inspection Due',
      description: 'Monthly inspection for Substation B is due tomorrow.',
      time: '1 day ago',
    },
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
                  <Link href="/" className="flex items-center cursor-pointer mb-4">
                    <Logo width={40} height={40} />
                    <h1 className="text-xl font-bold ml-2 text-primary">
                      C-PSMS
                    </h1>
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
            <Logo width={40} height={40} />
            <h1 className="text-xl font-bold ml-2 hidden sm:block">C-PSMS</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/80 relative"
              >
                <Bell className="text-primary-foreground" />
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-medium text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">You have {notifications.length} new messages.</p>
                </div>
                <div className="flex flex-col max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer">
                        <Avatar className="h-8 w-8 mt-1 border border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary">
                                <ShieldCheck className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <p className="font-semibold text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground/80">{notification.time}</p>
                        </div>
                    </div>
                    ))}
                </div>
                 <div className="p-2 text-center border-t">
                    <Button variant="link" size="sm" className="text-primary font-semibold">
                    View all notifications
                    </Button>
                </div>
            </PopoverContent>
          </Popover>

          <Avatar className="cursor-pointer">
            <AvatarImage
              src="https://placehold.co/40x40.png"
              alt="User avatar"
              data-ai-hint="user avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
