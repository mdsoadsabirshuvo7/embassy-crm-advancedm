// Drilldown reporting scaffold
export interface DrillNode { id: string; type: 'ORG'|'DEPT'|'STAFF'|'CASE'|'DOCUMENT'; label: string; parentId?: string; meta?: any; }

const nodes: Record<string, DrillNode[]> = {};
function ensure(orgId: string){ return nodes[orgId] ||= []; }

export const DrilldownService = {
  seed(orgId: string, seedNodes: DrillNode[]) { const list = ensure(orgId); for(const n of seedNodes){ if(!list.find(x=>x.id===n.id)) list.push(n); } },
  children(orgId: string, parentId?: string): DrillNode[] { return ensure(orgId).filter(n => n.parentId === parentId); },
  path(orgId: string, id: string): DrillNode[] { const all = ensure(orgId); const path: DrillNode[] = []; let current = all.find(n=>n.id===id); while(current){ path.unshift(current); current = current.parentId ? all.find(n=>n.id===current.parentId) : undefined; } return path; }
};
