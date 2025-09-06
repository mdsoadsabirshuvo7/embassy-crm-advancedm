// Notification system scaffold
export interface Notification { id: string; type: string; message: string; createdAt: string; read?: boolean; orgId?: string; }
import { v4 as uuid } from 'uuid';

const store: Record<string, Notification[]> = {};
function ensure(orgId: string) { return store[orgId] ||= []; }

export const NotificationService = {
  push(orgId: string, type: string, message: string): Notification {
    const n: Notification = { id: uuid(), type, message, createdAt: new Date().toISOString(), orgId };
    ensure(orgId).push(n);
    return n;
  },
  list(orgId: string): Notification[] { return ensure(orgId); },
  markRead(orgId: string, id: string) { const list = ensure(orgId); const n = list.find(x=>x.id===id); if(n) n.read = true; }
};
