// Dashboard builder scaffold
import { v4 as uuid } from 'uuid';

export interface DashboardWidget { id: string; type: string; config: any; orgId?: string; }
export interface DashboardLayout { id: string; name: string; widgetIds: string[]; orgId?: string; }

const widgets: Record<string, DashboardWidget[]> = {};
const layouts: Record<string, DashboardLayout[]> = {};
function ensureW(orgId: string){ return widgets[orgId] ||= []; }
function ensureL(orgId: string){ return layouts[orgId] ||= []; }

export const DashboardService = {
  addWidget(orgId: string, type: string, config: any): DashboardWidget { const w: DashboardWidget = { id: uuid(), type, config, orgId }; ensureW(orgId).push(w); return w; },
  listWidgets(orgId: string): DashboardWidget[] { return ensureW(orgId); },
  createLayout(orgId: string, name: string, widgetIds: string[]): DashboardLayout { const l: DashboardLayout = { id: uuid(), name, widgetIds, orgId }; ensureL(orgId).push(l); return l; },
  listLayouts(orgId: string): DashboardLayout[] { return ensureL(orgId); }
};
