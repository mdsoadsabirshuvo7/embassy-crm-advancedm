// Recruitment pipeline scaffold
import { v4 as uuid } from 'uuid';

export type CandidateStage = 'APPLIED'|'SCREEN'|'INTERVIEW'|'OFFER'|'HIRED'|'REJECTED';
export interface Candidate { id: string; name: string; email: string; stage: CandidateStage; appliedAt: string; orgId?: string; }

const candidates: Record<string, Candidate[]> = {};
function ensure(orgId: string) { return candidates[orgId] ||= []; }

export const RecruitmentService = {
  add(orgId: string, name: string, email: string): Candidate { const c: Candidate = { id: uuid(), name, email, stage: 'APPLIED', appliedAt: new Date().toISOString(), orgId }; ensure(orgId).push(c); return c; },
  move(orgId: string, id: string, stage: CandidateStage) { const list = ensure(orgId); const c = list.find(x=>x.id===id); if(c) c.stage = stage; },
  list(orgId: string): Candidate[] { return ensure(orgId); }
};
