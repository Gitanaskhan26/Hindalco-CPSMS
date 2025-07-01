
'use client';

import * as React from 'react';
import { useUser } from '@/context/user-context';
import { fetchNotificationsForUser } from '@/lib/notification-data';
import type { Notification } from '@/lib/types';

interface NotificationContextType {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  reloadNotifications: () => Promise<void>;
  updateNotificationsFromAction: (newNotifications: Notification[]) => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const reloadNotifications = React.useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }
    
    // Don't set loading to true for background polls
    // setIsLoading(true); 
    try {
      const userNotifications = await fetchNotificationsForUser(user.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false); // Only set loading to false on initial load
    }
  }, [user?.id]);

  const updateNotificationsFromAction = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.isRead).length);
  };

  React.useEffect(() => {
    if (user?.id) {
        setIsLoading(true);
        reloadNotifications();
    }
  }, [user?.id, reloadNotifications]);

  React.useEffect(() => {
    if (!user?.id) return;

    const intervalId = setInterval(() => {
      reloadNotifications();
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(intervalId);
  }, [user?.id, reloadNotifications]);

  const value = {
    notifications,
    isLoading,
    unreadCount,
    reloadNotifications,
    updateNotificationsFromAction,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
