import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  LogIn,
  LogOut
} from 'lucide-react';
import { auditLogger, type AuditLog } from '../../utils/auditLogger';
import { format } from 'date-fns';

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadAuditLogs();
    loadAuditStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, actionFilter, resourceFilter, userFilter, dateFilter]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const auditLogs = await auditLogger.getAuditLogs({ limit: 1000 });
      setLogs(auditLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditStats = async () => {
    try {
      const auditStats = await auditLogger.getAuditStats();
      setStats(auditStats);
    } catch (error) {
      console.error('Failed to load audit stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.resourceId && log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Resource filter
    if (resourceFilter !== 'all') {
      filtered = filtered.filter(log => log.resource === resourceFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(log => log.userId === userFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = Date.now();
      const timeRanges = {
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000
      };
      
      const timeRange = timeRanges[dateFilter as keyof typeof timeRanges];
      if (timeRange) {
        filtered = filtered.filter(log => now - log.timestamp <= timeRange);
      }
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return <LogIn className="w-4 h-4 text-success" />;
      case 'LOGOUT': return <LogOut className="w-4 h-4 text-muted-foreground" />;
      case 'CREATE': return <Plus className="w-4 h-4 text-success" />;
      case 'UPDATE': return <Edit className="w-4 h-4 text-warning" />;
      case 'DELETE': return <Trash2 className="w-4 h-4 text-destructive" />;
      case 'VIEW': return <Eye className="w-4 h-4 text-primary" />;
      case 'EXPORT': return <Download className="w-4 h-4 text-primary" />;
      case 'SETTINGS_CHANGE': return <Settings className="w-4 h-4 text-warning" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'DELETE': return 'bg-destructive text-destructive-foreground';
      case 'UPDATE': 
      case 'SETTINGS_CHANGE': return 'bg-warning text-warning-foreground';
      case 'CREATE': 
      case 'LOGIN': return 'bg-success text-success-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const exportAuditLogs = async () => {
    try {
      const csvContent = [
        ['Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 'IP Address'].join(','),
        ...filteredLogs.map(log => [
          format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
          log.userName,
          log.action,
          log.resource,
          log.resourceId || '',
          log.ipAddress || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
    }
  };

  const uniqueUsers = [...new Set(logs.map(log => ({ id: log.userId, name: log.userName })))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];
  const uniqueResources = [...new Set(logs.map(log => log.resource))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Audit Log Viewer</h1>
            <p className="text-muted-foreground">
              Track and monitor all system activities
            </p>
          </div>
        </div>
        <Button onClick={exportAuditLogs}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Report</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Action</label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Resource</label>
                  <Select value={resourceFilter} onValueChange={setResourceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resources</SelectItem>
                      {uniqueResources.map(resource => (
                        <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">User</label>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Range</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {logs.length} entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading audit logs...</div>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">No logs found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLogs.map((log, index) => (
                    <div key={`${log.id || index}`} className="flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{log.userName}</span>
                          <span className="text-muted-foreground">performed</span>
                          <span className="font-medium">{log.action.toLowerCase()}</span>
                          <span className="text-muted-foreground">on</span>
                          <span className="font-medium">{log.resource}</span>
                          {log.resourceId && (
                            <>
                              <span className="text-muted-foreground">ID:</span>
                              <code className="text-xs bg-muted px-1 rounded">{log.resourceId}</code>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}</span>
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                          {log.sessionId && <span>Session: {log.sessionId.slice(-8)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Total Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats.totalActions || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Actions by Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(stats.actionsByType || {}).map(([action, count]) => (
                  <div key={action} className="flex justify-between items-center">
                    <span className="text-sm">{action}</span>
                    <Badge variant="outline">{count as number}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Resource Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(stats.resourceAccess || {}).map(([resource, count]) => (
                  <div key={resource} className="flex justify-between items-center">
                    <span className="text-sm">{resource}</span>
                    <Badge variant="outline">{count as number}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(stats.recentActivity || []).slice(0, 5).map((log: AuditLog, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded">
                    {getActionIcon(log.action)}
                    <span className="text-sm">
                      <strong>{log.userName}</strong> {log.action.toLowerCase()} {log.resource}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Compliance Report</CardTitle>
              <CardDescription>
                Generate compliance reports for audit and regulatory purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Compliance Reporting</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced compliance reporting features available
                </p>
                <Button>Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditLogViewer;