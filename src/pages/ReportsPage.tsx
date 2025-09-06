import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ExportDropdown } from '@/components/export/ExportDropdown';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Filter, 
  Calendar,
  Users,
  DollarSign,
  FileText,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe,
  Building,
  Receipt
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('all');

  // Mock analytics data
  const overviewStats = {
    totalRevenue: 1284600,
    totalClients: 342,
    activeProjects: 87,
    completedProjects: 156,
    revenueGrowth: 12.5,
    clientGrowth: 8.3,
    projectGrowth: 15.2,
    avgProjectValue: 14800
  };

  const revenueByService = [
    { service: 'Visa Processing', revenue: 685000, percentage: 53.3, clients: 123 },
    { service: 'Document Verification', revenue: 285000, percentage: 22.2, clients: 89 },
    { service: 'Embassy Letters', revenue: 195000, percentage: 15.2, clients: 67 },
    { service: 'Consultation', revenue: 119600, percentage: 9.3, clients: 63 }
  ];

  const clientsByCountry = [
    { country: 'Bangladesh', clients: 145, percentage: 42.4 },
    { country: 'India', clients: 87, percentage: 25.4 },
    { country: 'Philippines', clients: 56, percentage: 16.4 },
    { country: 'Pakistan', clients: 32, percentage: 9.4 },
    { country: 'Others', clients: 22, percentage: 6.4 }
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 95000, clients: 25, projects: 18 },
    { month: 'Feb', revenue: 108000, clients: 28, projects: 22 },
    { month: 'Mar', revenue: 115000, clients: 32, projects: 25 },
    { month: 'Apr', revenue: 122000, clients: 35, projects: 28 },
    { month: 'May', revenue: 135000, clients: 39, projects: 31 },
    { month: 'Jun', revenue: 142000, clients: 41, projects: 34 }
  ];

  const employeePerformance = [
    { name: 'Sarah Ahmed', clients: 45, revenue: 287000, completion: 94, rating: 4.8 },
    { name: 'Mohammed Khan', clients: 38, revenue: 245000, completion: 89, rating: 4.6 },
    { name: 'Fatima Rahman', clients: 35, revenue: 225000, completion: 92, rating: 4.7 },
    { name: 'Ali Hassan', clients: 29, revenue: 185000, completion: 87, rating: 4.5 }
  ];

  // Dynamic report builder state (placed after dataset declarations to avoid TDZ)
  const datasets = {
    revenueByService,
    clientsByCountry,
    employeePerformance,
    monthlyTrends,
  } as const;
  type DatasetKey = keyof typeof datasets;
  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>('revenueByService');
  const allColumns = (key: DatasetKey) => Object.keys(datasets[key][0] || {});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns('revenueByService'));
  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };
  const currentRows = datasets[selectedDataset];
  const exportHeaders = visibleColumns;
  type DatasetRow = Record<string, unknown>;
  const getCell = (row: DatasetRow, key: string): unknown => row[key];
  const exportData = (currentRows as DatasetRow[]).map(r => {
    const out: Record<string, unknown> = {};
    visibleColumns.forEach(c => { out[c] = getCell(r, c); });
    return out;
  });


  const recentActivities = [
    { type: 'revenue', description: 'New invoice paid by Ahmed Hassan', amount: 25000, time: '2 hours ago' },
    { type: 'client', description: 'New client registration - Maria Santos', time: '4 hours ago' },
    { type: 'project', description: 'Visa processing completed for John Smith', time: '6 hours ago' },
    { type: 'milestone', description: 'Monthly revenue target achieved', time: '1 day ago' }
  ];

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="w-4 h-4 text-success" />;
      case 'client': return <Users className="w-4 h-4 text-primary" />;
      case 'project': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'milestone': return <Target className="w-4 h-4 text-warning" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: React.ElementType;
  }> = ({ title, value, change, changeType, icon: Icon }) => (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className={`text-xs flex items-center gap-1 ${
          changeType === 'positive' ? 'text-success' : 'text-destructive'
        }`}>
          {changeType === 'positive' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            data={[
              { Metric: 'Total Revenue', Value: formatCurrency(overviewStats.totalRevenue) },
              { Metric: 'Total Clients', Value: String(overviewStats.totalClients) },
              { Metric: 'Active Projects', Value: String(overviewStats.activeProjects) },
              { Metric: 'Completed Projects', Value: String(overviewStats.completedProjects) },
              { Metric: 'Revenue Growth', Value: `${overviewStats.revenueGrowth}%` },
              { Metric: 'Client Growth', Value: `${overviewStats.clientGrowth}%` },
              { Metric: 'Project Growth', Value: `${overviewStats.projectGrowth}%` },
              { Metric: 'Avg. Project Value', Value: formatCurrency(overviewStats.avgProjectValue) }
            ]}
            filename="overview_report"
            title="Overview Report"
            headers={["Metric","Value"]}
          />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(overviewStats.totalRevenue)}
          change={`+${overviewStats.revenueGrowth}% from last month`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Total Clients"
          value={overviewStats.totalClients.toString()}
          change={`+${overviewStats.clientGrowth}% from last month`}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Active Projects"
          value={overviewStats.activeProjects.toString()}
          change={`+${overviewStats.projectGrowth}% from last month`}
          changeType="positive"
          icon={Activity}
        />
        <StatCard
          title="Avg. Project Value"
          value={formatCurrency(overviewStats.avgProjectValue)}
          change="+5.8% from last month"
          changeType="positive"
          icon={Target}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue by Service
                </CardTitle>
                <CardDescription>Distribution of revenue across service types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {revenueByService.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.service}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatCurrency(item.revenue)}</div>
                        <div className="text-xs text-muted-foreground">{item.clients} clients</div>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">{item.percentage}%</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Clients by Country
                </CardTitle>
                <CardDescription>Geographic distribution of client base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {clientsByCountry.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.country}</span>
                      <div className="text-sm font-bold">{item.clients} clients</div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">{item.percentage}%</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest business activities and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      {activity.amount && (
                        <p className="text-xs text-success font-medium">{formatCurrency(activity.amount)}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(142000)}</div>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Avg. Deal Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(14800)}</div>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Revenue per Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(3756)}</div>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-4 px-4">
                {monthlyTrends.map((month, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-primary w-full rounded-t-sm min-h-4 mb-2"
                      style={{ height: `${(month.revenue / 150000) * 200}px` }}
                    ></div>
                    <div className="text-xs text-center">
                      <div className="font-medium">{month.month}</div>
                      <div className="text-muted-foreground">{formatCurrency(month.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">New Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">41</div>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Client Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">94.2%</div>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Avg. Client Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(18750)}</div>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +6.4% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Client Acquisition Funnel</CardTitle>
              <CardDescription>Client conversion pipeline analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Website Visits</span>
                  <span className="text-sm font-bold">1,245</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Inquiries</span>
                  <span className="text-sm font-bold">185</span>
                </div>
                <Progress value={74.7} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Consultations</span>
                  <span className="text-sm font-bold">89</span>
                </div>
                <Progress value={48.1} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conversions</span>
                  <span className="text-sm font-bold">41</span>
                </div>
                <Progress value={46.1} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
              <CardDescription>Individual performance metrics and rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeePerformance.map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.clients}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(employee.revenue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={employee.completion} className="h-2 w-16" />
                          <span className="text-sm">{employee.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{employee.rating}</span>
                          <span className="text-xs text-muted-foreground">/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            employee.completion >= 90 
                              ? 'bg-success text-success-foreground' 
                              : employee.completion >= 80 
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-destructive text-destructive-foreground'
                          }
                        >
                          {employee.completion >= 90 ? 'Excellent' : 
                           employee.completion >= 80 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Business Trends</CardTitle>
              <CardDescription>Key performance indicators over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">↗ 15.2%</div>
                  <div className="text-sm text-muted-foreground">Project Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">↗ 12.5%</div>
                  <div className="text-sm text-muted-foreground">Revenue Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">↗ 8.3%</div>
                  <div className="text-sm text-muted-foreground">Client Growth</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Monthly Progress</h4>
                {monthlyTrends.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="font-medium">{month.month}</div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-medium">{formatCurrency(month.revenue)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Clients: </span>
                        <span className="font-medium">{month.clients}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Projects: </span>
                        <span className="font-medium">{month.projects}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dynamic Report Builder</CardTitle>
                  <CardDescription>Create custom exports from predefined datasets</CardDescription>
                </div>
                <div className="flex gap-2">
                  <ExportDropdown
                    data={exportData}
                    filename={`custom_${selectedDataset}`}
                    title={`Custom Report - ${selectedDataset}`}
                    headers={exportHeaders}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Dataset</Label>
                  <Select value={selectedDataset} onValueChange={(v) => { const k = v as DatasetKey; setSelectedDataset(k); setVisibleColumns(allColumns(k)); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenueByService">Revenue By Service</SelectItem>
                      <SelectItem value="clientsByCountry">Clients By Country</SelectItem>
                      <SelectItem value="employeePerformance">Employee Performance</SelectItem>
                      <SelectItem value="monthlyTrends">Monthly Trends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Columns</Label>
                  <div className="flex flex-wrap gap-2">
                    {allColumns(selectedDataset).map(col => {
                      const active = visibleColumns.includes(col);
                      return (
                        <button
                          type="button"
                          key={col}
                          onClick={() => toggleColumn(col)}
                          className={`text-xs px-2 py-1 rounded border transition ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground hover:bg-accent'} `}
                        >
                          {active ? '✓ ' : ''}{col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map(col => (
                        <TableHead key={col} className="capitalize">{col.replace(/([A-Z])/g,' $1').trim()}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRows.map((row, idx) => (
                      <TableRow key={idx}>
                        {visibleColumns.map(col => {
                          const value = (row as Record<string, unknown>)[col];
                          return (
                            <TableCell key={col} className="text-sm font-mono">
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {currentRows.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">No data available for this dataset.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;