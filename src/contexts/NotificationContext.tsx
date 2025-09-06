import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'deadline' | 'task' | 'document' | 'payment' | 'hr';
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
  userId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearExpired: () => void;
  getNotificationsByCategory: (category: string) => Notification[];
  getNotificationsByPriority: (priority: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
      }));
    }
    return [];
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date()
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-remove low priority notifications after 24 hours
    if (notification.priority === 'low') {
      setTimeout(() => {
        deleteNotification(notification.id);
      }, 24 * 60 * 60 * 1000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearExpired = () => {
    const now = new Date();
    setNotifications(prev => 
      prev.filter(n => !n.expiresAt || n.expiresAt > now)
    );
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(n => n.category === category);
  };

  const getNotificationsByPriority = (priority: string) => {
    return notifications.filter(n => n.priority === priority);
  };

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Clear expired notifications every hour
  useEffect(() => {
    const interval = setInterval(clearExpired, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate sample notifications for demo
  useEffect(() => {
    if (notifications.length === 0) {
      const sampleNotifications = [
        {
          title: 'Document Expiring Soon',
          message: 'Client passport expires in 30 days',
          type: 'warning' as const,
          priority: 'high' as const,
          category: 'document' as const,
          actionRequired: true,
          actionUrl: '/documents'
        },
        {
          title: 'Payment Received',
          message: 'Payment of $500 received from John Doe',
          type: 'success' as const,
          priority: 'medium' as const,
          category: 'payment' as const,
          actionRequired: false
        },
        {
          title: 'New Task Assigned',
          message: 'Process visa application for Maria Garcia',
          type: 'info' as const,
          priority: 'medium' as const,
          category: 'task' as const,
          actionRequired: true,
          actionUrl: '/tasks'
        }
      ];

      sampleNotifications.forEach(n => addNotification(n));
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearExpired,
      getNotificationsByCategory,
      getNotificationsByPriority
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};