import React, { useState } from 'react';
import { Bell, X, Check, CheckCheck, Filter, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationsByCategory,
    getNotificationsByPriority
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-warning text-warning-foreground';
      case 'medium':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredNotifications = () => {
    let filtered = notifications;

    // Filter by category
    if (activeTab !== 'all') {
      filtered = getNotificationsByCategory(activeTab);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }

    return filtered.sort((a, b) => {
      // Sort by priority first (urgent > high > medium > low)
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - 
                          priorityOrder[a.priority as keyof typeof priorityOrder];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by read status (unread first)
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      
      // Finally by creation time (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const categories = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'system', name: 'System', count: getNotificationsByCategory('system').length },
    { id: 'deadline', name: 'Deadlines', count: getNotificationsByCategory('deadline').length },
    { id: 'task', name: 'Tasks', count: getNotificationsByCategory('task').length },
    { id: 'document', name: 'Documents', count: getNotificationsByCategory('document').length },
    { id: 'payment', name: 'Payments', count: getNotificationsByCategory('payment').length },
    { id: 'hr', name: 'HR', count: getNotificationsByCategory('hr').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-foreground" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notification Center</h1>
            <p className="text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Notification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="relative">
              {category.name}
              {category.count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications().length === 0 ? (
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! No notifications to show.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications().map(notification => (
                <Card 
                  key={notification.id}
                  className={`border-0 transition-all cursor-pointer ${
                    notification.isRead 
                      ? 'bg-card/60 backdrop-blur-sm' 
                      : 'bg-card/90 backdrop-blur-sm border-l-4 border-l-primary'
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {notification.title}
                            </h4>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {notification.actionRequired && (
                              <Badge variant="destructive">
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${notification.isRead ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </span>
                            <Badge variant="outline">
                              {notification.category}
                            </Badge>
                          </div>
                          
                          {notification.actionRequired && notification.actionUrl && (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.actionUrl!;
                              }}
                            >
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;