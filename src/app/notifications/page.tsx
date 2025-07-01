'use client';

import * as React from 'react';
import { useUser } from '@/context/user-context';
import { fetchNotificationsForUser } from '@/lib/notification-data';
import type { Notification } from '@/lib/types';
import { NotificationItem } from '@/components/notification-item';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, BellRing } from 'lucide-react';
import { subDays } from 'date-fns';

export default function NotificationsPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const allNotifications = await fetchNotificationsForUser(user.id);
        const sevenDaysAgo = subDays(new Date(), 7);
        
        const filtered = allNotifications.filter(n => {
            const isActioned = n.title.toLowerCase().includes('approved') || n.title.toLowerCase().includes('rejected');
            const isRecent = new Date(n.timestamp) >= sevenDaysAgo;
            return isActioned && isRecent;
        });
        setNotifications(filtered);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full border-2 border-primary/20">
                <BellRing className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Notification History</CardTitle>
                <CardDescription>Showing all approved and rejected permits and passes from the last 7 days.</CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col border-t">
            {isLoading ? (
              <div className="space-y-px bg-muted/50">
                <Skeleton className="h-[88px] w-full" />
                <Skeleton className="h-[88px] w-full" />
                <Skeleton className="h-[88px] w-full" />
                <Skeleton className="h-[88px] w-full" />
              </div>
            ) : notifications.length > 0 ? (
                <div className="divide-y">
                    {notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Frown className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No Recent Notifications</h3>
                <p className="mt-2 text-sm">There are no approved or rejected notifications in the last 7 days.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
