import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { auditLogger, type AuditLog } from '@/utils/auditLogger';
import { useTenant } from '@/contexts/TenantContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExportService } from '@/services/exportService';

interface Props { limit?: number }

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'bg-green-500/15 text-green-500',
  LOGOUT: 'bg-gray-500/15 text-gray-500',
  CREATE: 'bg-blue-500/15 text-blue-500',
  UPDATE: 'bg-amber-500/15 text-amber-600',
  DELETE: 'bg-destructive/15 text-destructive',
  EXPORT: 'bg-purple-500/15 text-purple-500',
  VIEW: 'bg-muted text-muted-foreground',
  SETTINGS_CHANGE: 'bg-indigo-500/15 text-indigo-500',
  PERMISSION_CHANGE: 'bg-rose-500/15 text-rose-500'
};

const AuditLogViewer: React.FC<Props> = ({ limit = 100 }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const { organizations, currentOrgId, switchOrg } = useTenant();
  const [orgFilter, setOrgFilter] = useState<string | 'all'>(currentOrgId || 'all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
  const data = await auditLogger.getAuditLogs({ limit });
      setLogs(data);
    } catch (e) {
      setError('Failed to load audit logs');
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => logs.filter(l => {
    const term = search.toLowerCase();
    const matchesSearch = !term || [l.userName, l.action, l.resource, l.resourceId].some(v => v?.toLowerCase().includes(term));
    const matchesAction = actionFilter === 'all' || l.action === actionFilter;
    const matchesOrg = orgFilter === 'all' || l.orgId === orgFilter;
    return matchesSearch && matchesAction && matchesOrg;
  }), [logs, search, actionFilter, orgFilter]);

  const exportLogs = async (format: 'csv' | 'excel' | 'pdf') => {
    if (filtered.length === 0) return;
    await ExportService.exportData({
      filename: 'audit_logs',
      title: 'Audit Logs',
      headers: ['Timestamp','User','Action','Resource','Resource ID','Details'],
      data: filtered.map(l => ({
        Timestamp: new Date(l.timestamp).toLocaleString(),
        User: `${l.userName} (${l.userId})`,
        Action: l.action,
        Resource: l.resource,
        'Resource ID': l.resourceId || '',
        Details: l.newData ? JSON.stringify(l.newData).slice(0,100) : ''
      })),
      format
    });
  };

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between space-y-0">
        <CardTitle className="text-base">Audit Logs</CardTitle>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => exportLogs('csv')} disabled={loading || filtered.length===0}>CSV</Button>
            <Button size="sm" variant="outline" onClick={() => exportLogs('excel')} disabled={loading || filtered.length===0}>Excel</Button>
            <Button size="sm" variant="outline" onClick={() => exportLogs('pdf')} disabled={loading || filtered.length===0}>PDF</Button>
            <Button size="sm" onClick={load} disabled={loading}>Refresh</Button>
            {organizations.length > 1 && (
              <select
                value={orgFilter}
                onChange={e => {
                  const val = e.target.value as string | 'all';
                  setOrgFilter(val);
                  if (val !== 'all') switchOrg(val);
                }}
                className="border bg-background rounded px-2 py-1 text-xs"
              >
                <option value="all">All Orgs</option>
                {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <Input placeholder="Search user, action, resource..." value={search} onChange={e => setSearch(e.target.value)} className="md:max-w-xs" />
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="border bg-background rounded px-2 py-1 text-xs">
            <option value="all">All Actions</option>
            {Array.from(new Set(logs.map(l => l.action))).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="text-xs text-muted-foreground self-center">{filtered.length} / {logs.length} entries</div>
        </div>
        <div className="space-y-2 max-h-96 overflow-auto pr-1">
          {error && <div className="text-destructive text-xs">{error}</div>}
          {loading && <div className="text-muted-foreground">Loading...</div>}
          {!loading && filtered.length === 0 && !error && <div className="text-muted-foreground">No audit logs match filters.</div>}
          {!loading && filtered.map(l => (
            <div key={`${l.timestamp}_${l.userId}_${l.action}`} className="flex items-start justify-between border-b border-border/40 py-2">
              <div className="space-y-1 pr-4 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={ACTION_COLORS[l.action] || 'bg-muted'}>{l.action}</Badge>
                  <span className="font-medium truncate max-w-[140px]">{l.userName}</span>
                  <span className="text-muted-foreground text-[10px]">{l.resource}</span>
                  {l.resourceId && <code className="text-[10px] bg-muted px-1 rounded">{l.resourceId}</code>}
                </div>
                <div className="text-[10px] text-muted-foreground">{new Date(l.timestamp).toLocaleString()} • Session {l.sessionId?.slice(-6)}</div>
              </div>
              {l.newData && (
                <code className="text-[10px] bg-muted px-1 py-0.5 rounded max-w-[180px] truncate" title={JSON.stringify(l.newData)}>
                  {JSON.stringify(l.newData)}
                </code>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;