// Native e-signature scaffold
import { v4 as uuid } from 'uuid';

export interface SignatureRequest { id: string; documentId: string; signerEmail: string; status: 'PENDING'|'SIGNED'|'CANCELLED'; createdAt: string; signedAt?: string; orgId?: string; }

const requests: Record<string, SignatureRequest[]> = {};
function ensure(orgId: string) { return requests[orgId] ||= []; }

export const ESignService = {
  create(orgId: string, documentId: string, signerEmail: string): SignatureRequest {
    const r: SignatureRequest = { id: uuid(), documentId, signerEmail, status: 'PENDING', createdAt: new Date().toISOString(), orgId };
    ensure(orgId).push(r); return r;
  },
  sign(orgId: string, id: string) { const list = ensure(orgId); const r = list.find(x=>x.id===id); if(r && r.status==='PENDING'){ r.status='SIGNED'; r.signedAt=new Date().toISOString(); } },
  list(orgId: string): SignatureRequest[] { return ensure(orgId); }
};
