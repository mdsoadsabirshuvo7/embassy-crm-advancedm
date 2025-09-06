// Document versioning scaffold
import { v4 as uuid } from 'uuid';

export interface DocumentVersion { id: string; documentId: string; version: number; hash: string; createdAt: string; createdBy?: string; orgId?: string; }

const versions: Record<string, DocumentVersion[]> = {};
function ensure(orgId: string){ return versions[orgId] ||= []; }

export const VersioningService = {
  addVersion(orgId: string, documentId: string, hash: string, createdBy?: string){ const list = ensure(orgId); const version = list.filter(v=>v.documentId===documentId).length + 1; const v: DocumentVersion = { id: uuid(), documentId, version, hash, createdAt: new Date().toISOString(), createdBy, orgId }; list.push(v); return v; },
  list(orgId: string, documentId: string){ return ensure(orgId).filter(v=>v.documentId===documentId); }
};
