'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  Menu,
  Map,
  FileText,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { useUser } from '@/context/user-context';
import { useNotification } from '@/context/notification-context';
import { NotificationItem } from './notification-item';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';

export const HindalcoHeader = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const { notifications, unreadCount, isLoading: isNotificationsLoading } = useNotification();
  
  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Permits', href: '/permits', icon: FileText },
    { label: 'Plant Map', href: '/map', icon: Map },
  ];

  if (!user || user.type !== 'employee') {
    return null;
  }
  
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

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
              <SheetContent side="left" className="p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="p-4">
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

          <Link href="/" className="flex items-center cursor-pointer gap-3">
            <Logo width={40} height={40} />
            <span className="text-xl font-semibold hidden md:inline">C-PSMS</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
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
                className="hover:bg-primary/90 relative"
              >
                <Bell className="text-primary-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-medium text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">You have {unreadCount} new messages.</p>
                </div>
                <ScrollArea className="max-h-96">
                    <div className="flex flex-col">
                        {isNotificationsLoading ? (
                            <div className="p-4 space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <NotificationItem key={notification.id} notification={notification} />
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground p-8 text-sm">You're all caught up!</p>
                        )}
                    </div>
                </ScrollArea>
                 <div className="p-2 text-center border-t">
                    <Button variant="link" size="sm" className="text-primary font-semibold" asChild>
                        <Link href="/notifications">View all notifications</Link>
                    </Button>
                </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-primary/90">
                <Avatar className="h-10 w-10 border-2 border-primary-foreground/20 bg-primary-foreground/10 hover:border-accent">
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={user.name}
                    data-ai-hint={user.avatarHint}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.designation}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Department: {user.department}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Emp Code: {user.id}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
