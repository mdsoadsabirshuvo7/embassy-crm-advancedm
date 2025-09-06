import { offlineStorage } from './offlineStorage';

export interface AuditLog {
  id?: number;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
  sessionId?: string;
  orgId?: string; // tenant scope
}

class AuditLogger {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeStorage(): Promise<void> {
    try {
      await offlineStorage.init();
    } catch (error) {
      console.error('Failed to initialize audit logging storage:', error);
    }
  }

  async log<TOld = unknown, TNew = unknown>(
    userId: string,
    userName: string,
    action: string,
    resource: string,
    resourceId?: string,
    oldData?: TOld,
    newData?: TNew
  ): Promise<void> {
    // Attempt to derive orgId from localStorage (set by TenantContext)
    const activeOrgId = localStorage.getItem('activeOrgId') || undefined;
    const auditEntry: AuditLog = {
      userId,
      userName,
      action,
      resource,
      resourceId,
      oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : undefined,
      newData: newData ? JSON.parse(JSON.stringify(newData)) : undefined,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      orgId: activeOrgId
    };

    try {
      await offlineStorage.store('audit_logs', auditEntry);
      console.log('Audit log recorded:', auditEntry);
    } catch (error) {
      console.error('Failed to record audit log:', error);
    }
  }

  // Convenience methods for common actions
  async logLogin(userId: string, userName: string): Promise<void> {
    await this.log(userId, userName, 'LOGIN', 'auth');
  }

  async logLogout(userId: string, userName: string): Promise<void> {
    await this.log(userId, userName, 'LOGOUT', 'auth');
  }

  async logCreate<T>(userId: string, userName: string, resource: string, resourceId: string, data: T): Promise<void> {
    await this.log(userId, userName, 'CREATE', resource, resourceId, undefined, data);
  }

  async logUpdate<TOld, TNew>(userId: string, userName: string, resource: string, resourceId: string, oldData: TOld, newData: TNew): Promise<void> {
    await this.log(userId, userName, 'UPDATE', resource, resourceId, oldData, newData);
  }

  async logDelete<T>(userId: string, userName: string, resource: string, resourceId: string, data: T): Promise<void> {
    await this.log(userId, userName, 'DELETE', resource, resourceId, data);
  }

  async logView(userId: string, userName: string, resource: string, resourceId?: string): Promise<void> {
    await this.log(userId, userName, 'VIEW', resource, resourceId);
  }

  async logExport(userId: string, userName: string, resource: string, format: string): Promise<void> {
    await this.log(userId, userName, 'EXPORT', resource, undefined, undefined, { format });
  }

  async logSettingsChange<T>(userId: string, userName: string, setting: string, oldValue: T, newValue: T): Promise<void> {
    await this.log(userId, userName, 'SETTINGS_CHANGE', 'settings', setting, oldValue, newValue);
  }

  async logPermissionChange(userId: string, userName: string, targetUserId: string, oldPermissions: string[] | Record<string, unknown>, newPermissions: string[] | Record<string, unknown>): Promise<void> {
    await this.log(userId, userName, 'PERMISSION_CHANGE', 'user', targetUserId, oldPermissions, newPermissions);
  }

  // Retrieve audit logs with filtering
  async getAuditLogs(filters?: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: number;
    endDate?: number;
    limit?: number;
  }): Promise<AuditLog[]> {
    try {
  let logs = await offlineStorage.getAll('audit_logs') as AuditLog[];
      
      // Apply filters
      if (filters) {
        if (filters.userId) {
          logs = logs.filter(log => log.userId === filters.userId);
        }
        if (filters.resource) {
          logs = logs.filter(log => log.resource === filters.resource);
        }
        if (filters.action) {
          logs = logs.filter(log => log.action === filters.action);
        }
        if (filters.startDate) {
          logs = logs.filter(log => log.timestamp >= filters.startDate!);
        }
        if (filters.endDate) {
          logs = logs.filter(log => log.timestamp <= filters.endDate!);
        }
      }

      // Sort by timestamp (newest first)
      logs.sort((a, b) => b.timestamp - a.timestamp);

      // Apply limit
      if (filters?.limit) {
        logs = logs.slice(0, filters.limit);
      }

      return logs;
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error);
      return [];
    }
  }

  // Get audit statistics
  async getAuditStats(userId?: string): Promise<{
    totalActions: number;
    actionsByType: Record<string, number>;
    resourceAccess: Record<string, number>;
    recentActivity: AuditLog[];
  }> {
    try {
      const logs = await this.getAuditLogs(userId ? { userId } : undefined);
      
      const actionsByType: Record<string, number> = {};
      const resourceAccess: Record<string, number> = {};

      logs.forEach(log => {
        actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
        resourceAccess[log.resource] = (resourceAccess[log.resource] || 0) + 1;
      });

      return {
        totalActions: logs.length,
        actionsByType,
        resourceAccess,
        recentActivity: logs.slice(0, 10) // Last 10 activities
      };
    } catch (error) {
      console.error('Failed to get audit stats:', error);
      return {
        totalActions: 0,
        actionsByType: {},
        resourceAccess: {},
        recentActivity: []
      };
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real application, you might want to get this from your backend
      // For now, return a placeholder
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  // Generate compliance report
  async generateComplianceReport(startDate: number, endDate: number): Promise<{
    period: { start: Date; end: Date };
    totalActions: number;
    userActions: Record<string, number>;
    sensitiveActions: AuditLog[];
    dataChanges: AuditLog[];
    exportedData: AuditLog[];
  }> {
    const logs = await this.getAuditLogs({ startDate, endDate });
    
    const userActions: Record<string, number> = {};
    const sensitiveActions = logs.filter(log => 
      ['DELETE', 'PERMISSION_CHANGE', 'SETTINGS_CHANGE'].includes(log.action)
    );
    const dataChanges = logs.filter(log => 
      ['CREATE', 'UPDATE', 'DELETE'].includes(log.action)
    );
    const exportedData = logs.filter(log => log.action === 'EXPORT');

    logs.forEach(log => {
      userActions[log.userName] = (userActions[log.userName] || 0) + 1;
    });

    return {
      period: { start: new Date(startDate), end: new Date(endDate) },
      totalActions: logs.length,
      userActions,
      sensitiveActions,
      dataChanges,
      exportedData
    };
  }
}

export const auditLogger = new AuditLogger();