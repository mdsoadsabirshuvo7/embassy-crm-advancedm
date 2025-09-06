// Attendance & Leave scaffold
import { v4 as uuid } from 'uuid';

export interface AttendanceRecord { id: string; userId: string; date: string; checkIn?: string; checkOut?: string; locationHint?: string; orgId?: string; }
export interface LeaveRequest { id: string; userId: string; start: string; end: string; status: 'PENDING'|'APPROVED'|'REJECTED'; submittedAt: string; orgId?: string; }

const attendance: Record<string, AttendanceRecord[]> = {};
const leaves: Record<string, LeaveRequest[]> = {};
function ensureA(orgId: string){ return attendance[orgId] ||= []; }
function ensureL(orgId: string){ return leaves[orgId] ||= []; }

export const AttendanceService = {
  checkIn(orgId: string, userId: string, locationHint?: string){ const r: AttendanceRecord = { id: uuid(), userId, date: new Date().toISOString().slice(0,10), checkIn: new Date().toISOString(), locationHint, orgId }; ensureA(orgId).push(r); return r; },
  checkOut(orgId: string, recordId: string){ const list = ensureA(orgId); const rec = list.find(r=>r.id===recordId); if(rec && !rec.checkOut) rec.checkOut = new Date().toISOString(); },
  requestLeave(orgId: string, userId: string, start: string, end: string){ const lr: LeaveRequest = { id: uuid(), userId, start, end, status:'PENDING', submittedAt: new Date().toISOString(), orgId }; ensureL(orgId).push(lr); return lr; },
  decideLeave(orgId: string, id: string, status: 'APPROVED'|'REJECTED'){ const list = ensureL(orgId); const lr = list.find(l=>l.id===id); if(lr) lr.status=status; },
  listAttendance(orgId: string){ return ensureA(orgId); },
  listLeaves(orgId: string){ return ensureL(orgId); }
};
