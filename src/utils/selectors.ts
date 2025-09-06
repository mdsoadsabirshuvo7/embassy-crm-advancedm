import { LocalStorageService } from '@/services/localStorageService';
import { useTenant } from '@/contexts/TenantContext';
import { useMemo } from 'react';

// Internal caches keyed by orgId with simple invalidation timestamp
const employeeCache: Record<string, { ts: number; map: Record<string,string> }> = {};
const clientCache: Record<string, { ts: number; map: Record<string,string> }> = {};
const STALE_MS = 30_000; // 30s reuse window; tweak as needed

export const getEmployeeMap = (orgId?: string | null) => {
  const key = orgId || 'global';
  const now = Date.now();
  const cached = employeeCache[key];
  if (cached && now - cached.ts < STALE_MS) return cached.map;
  const employees = LocalStorageService.getEmployees(); // already filtered by activeOrg inside service
  const map: Record<string, string> = {};
  employees.forEach(e => { map[e.id] = e.employeeId ? `${e.employeeId} - ${e.department}` : e.id; });
  employeeCache[key] = { ts: now, map };
  return map;
};

export const getClientMap = (orgId?: string | null) => {
  const key = orgId || 'global';
  const now = Date.now();
  const cached = clientCache[key];
  if (cached && now - cached.ts < STALE_MS) return cached.map;
  const clients = LocalStorageService.getClients();
  const map: Record<string, string> = {};
  clients.forEach(c => { map[c.id] = c.name; });
  clientCache[key] = { ts: now, map };
  return map;
};

// React hooks that recompute when org changes
export const useEmployeeMap = () => {
  const { currentOrgId } = useTenant();
  return useMemo(() => getEmployeeMap(currentOrgId), [currentOrgId]);
};

export const useClientMap = () => {
  const { currentOrgId } = useTenant();
  return useMemo(() => getClientMap(currentOrgId), [currentOrgId]);
};

// Fallback name helpers used by legacy seeded tasks
export const fallbackEmployeeName = (id: string) => {
  switch (id) {
    case '1': return 'Sarah Ahmed';
    case '2': return 'Mohammed Khan';
    case '3': return 'Fatima Rahman';
    case '4': return 'Ali Hassan';
    default: return 'Unknown';
  }
};
export const fallbackClientName = (id: string) => {
  switch (id) {
    case '1': return 'Ahmed Hassan';
    case '2': return 'Maria Santos';
    case '3': return 'John Smith';
    case '4': return 'Ali Hassan';
    default: return 'Client';
  }
};
