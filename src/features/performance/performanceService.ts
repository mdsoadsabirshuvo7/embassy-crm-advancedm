// Performance & OKR scaffold
import { v4 as uuid } from 'uuid';

export interface Objective { id: string; title: string; ownerId: string; period: string; progress: number; orgId?: string; }
export interface KeyResult { id: string; objectiveId: string; metric: string; target: number; current: number; orgId?: string; }

const objectives: Record<string, Objective[]> = {};
const keyResults: Record<string, KeyResult[]> = {};
function ensureObj(orgId: string){ return objectives[orgId] ||= []; }
function ensureKr(orgId: string){ return keyResults[orgId] ||= []; }

export const PerformanceService = {
  createObjective(orgId: string, title: string, ownerId: string, period: string): Objective { const o: Objective = { id: uuid(), title, ownerId, period, progress:0, orgId }; ensureObj(orgId).push(o); return o; },
  addKeyResult(orgId: string, objectiveId: string, metric: string, target: number): KeyResult { const k: KeyResult = { id: uuid(), objectiveId, metric, target, current:0, orgId }; ensureKr(orgId).push(k); return k; },
  listObjectives(orgId: string): Objective[] { return ensureObj(orgId); },
  listKeyResults(orgId: string, objectiveId: string): KeyResult[] { return ensureKr(orgId).filter(k=>k.objectiveId===objectiveId); }
};
