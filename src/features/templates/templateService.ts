// Template marketplace scaffold
import { v4 as uuid } from 'uuid';

export interface Template { id: string; name: string; category: string; content: string; orgId?: string; system?: boolean; }

const templates: Template[] = [
  { id: 'sys-passport-form', name: 'Passport Form', category: 'Embassy', content: '--- passport form placeholder ---', system: true },
  { id: 'sys-hr-offer', name: 'Offer Letter', category: 'HR', content: '--- offer letter placeholder ---', system: true }
];

export const TemplateService = {
  list(orgId?: string): Template[] { return templates.filter(t => !t.orgId || t.orgId === orgId); },
  add(orgId: string, name: string, category: string, content: string): Template { const t: Template = { id: uuid(), name, category, content, orgId }; templates.push(t); return t; }
};
