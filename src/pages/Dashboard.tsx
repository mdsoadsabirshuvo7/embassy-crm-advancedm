import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Activity,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MockDataService } from '@/services/mockDataService';
import { formatCurrency } from '@/lib/utils';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { DocumentExpiryTracker } from '@/components/dashboard/DocumentExpiryTracker';

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  positive?: boolean;
}> = ({ title, value, change, icon: Icon, positive = true }) => (
  <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className={`text-xs ${positive ? 'text-success' : 'text-destructive'} flex items-center gap-1`}>
        <TrendingUp className="w-3 h-3" />
        {change} from last month
      </p>
    </CardContent>
  </Card>
);

const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, type: 'client', message: 'New client registered: Ahmed Hassan', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'invoice', message: 'Invoice #INV-001 paid by Maria Santos', time: '4 hours ago', status: 'success' },
    { id: 3, type: 'task', message: 'Document verification overdue for John Doe', time: '6 hours ago', status: 'warning' },
    { id: 4, type: 'employee', message: 'Sarah joined as HR Assistant', time: '1 day ago', status: 'info' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info': return <Clock className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest updates from your system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              {getStatusIcon(activity.status)}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = () => {
  const { user, organization } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        if (MockDataService.isDemoUser()) {
          const stats = await MockDataService.getMockDashboardStats();
          setDashboardStats(stats);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return <div className="space-y-8"><div className="animate-pulse">Loading dashboard...</div></div>;
  }

  const stats = dashboardStats ? [
    { title: 'Total Clients', value: dashboardStats.clients.total.toString(), change: dashboardStats.clients.growth, icon: Users },
    { title: 'Monthly Revenue', value: formatCurrency(dashboardStats.revenue.monthly), change: dashboardStats.revenue.growth, icon: DollarSign },
    { title: 'Active Tasks', value: dashboardStats.tasks.active.toString(), change: `${dashboardStats.tasks.overdue} overdue`, icon: FileText, positive: dashboardStats.tasks.overdue === 0 },
    { title: 'Team Members', value: dashboardStats.employees.total.toString(), change: `${dashboardStats.employees.onLeave} on leave`, icon: Users },
  ] : [];

  const projectProgress = [
    { name: 'Visa Processing', progress: 75, total: 120, completed: 90 },
    { name: 'Document Verification', progress: 60, total: 80, completed: 48 },
    { name: 'Client Onboarding', progress: 90, total: 50, completed: 45 },
  ];

  // Mock analytics data
  const revenueData = [
    { name: 'Jan', value: 12500 },
    { name: 'Feb', value: 15800 },
    { name: 'Mar', value: 14200 },
    { name: 'Apr', value: 18900 },
    { name: 'May', value: 22100 },
    { name: 'Jun', value: 25400 },
    { name: 'Jul', value: 28000 },
  ];

  const clientsData = [
    { name: 'Jan', active: 45, pending: 12, inactive: 3 },
    { name: 'Feb', active: 52, pending: 8, inactive: 2 },
    { name: 'Mar', active: 48, pending: 15, inactive: 4 },
    { name: 'Apr', active: 61, pending: 9, inactive: 1 },
    { name: 'May', active: 68, pending: 11, inactive: 2 },
    { name: 'Jun', active: 73, pending: 7, inactive: 1 },
    { name: 'Jul', active: 79, pending: 13, inactive: 3 },
  ];

  const tasksData = [
    { name: 'Completed', value: 145, fill: 'hsl(var(--success))' },
    { name: 'In Progress', value: 23, fill: 'hsl(var(--warning))' },
    { name: 'To Do', value: 18, fill: 'hsl(var(--primary))' },
    { name: 'Overdue', value: 4, fill: 'hsl(var(--destructive))' },
  ];

  const documentsData = [
    { name: 'Jan', value: 145 },
    { name: 'Feb', value: 167 },
    { name: 'Mar', value: 189 },
    { name: 'Apr', value: 203 },
    { name: 'May', value: 225 },
    { name: 'Jun', value: 248 },
    { name: 'Jul', value: 267 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening at your agency today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString()}
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Project Progress</CardTitle>
                  <CardDescription>Current status of ongoing projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {projectProgress.map((project) => (
                    <div key={project.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-foreground">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.completed}/{project.total}
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <RecentActivity />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart
              type="revenue"
              title="Revenue Trends"
              description="Monthly revenue growth over time"
              data={revenueData}
              timeRange="7 months"
            />
            <AnalyticsChart
              type="clients"
              title="Client Distribution"
              description="Client status breakdown by month"
              data={clientsData}
              timeRange="7 months"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart
              type="tasks"
              title="Task Status"
              description="Current task distribution"
              data={tasksData}
              timeRange="Current"
            />
            <AnalyticsChart
              type="documents"
              title="Document Processing"
              description="Documents processed over time"
              data={documentsData}
              timeRange="7 months"
            />
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DocumentExpiryTracker />
            </div>
            <RecentActivity />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};