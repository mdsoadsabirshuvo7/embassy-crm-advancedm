import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  UserCheck, 
  FileText, 
  ClipboardList, 
  Settings, 
  Building,
  PieChart,
  CreditCard,
  Receipt,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useModules, ModuleName } from '@/contexts/ModuleContext';
import { useTenant } from '@/contexts/TenantContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'HR_MANAGER', 'EMPLOYEE'] },
  { name: 'Clients', href: '/clients', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'] },
  { name: 'Accounting', href: '/accounting', icon: Calculator, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] },
  { name: 'Invoices', href: '/invoices', icon: Receipt, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] },
  { name: 'Expenses', href: '/expenses', icon: CreditCard, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] },
  { name: 'HR Management', href: '/hr', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'] },
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'HR_MANAGER'] },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList, roles: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'EMPLOYEE'] },
  { name: 'Reports', href: '/reports', icon: PieChart, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'HR_MANAGER'] },
  { name: 'Settings', href: '/settings/general', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { isModuleEnabled } = useModules();
  const { currentOrgId, organizations, switchOrg } = useTenant();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const isKnownModule = (value: string): value is ModuleName => {
    return [
      'dashboard','clients','accounting','hr','documents','tasks','reports','invoices','expenses'
    ].includes(value);
  };

  const filteredNavigation = navigation.filter(item => {
    if (!user?.role) return false;
    if (!item.roles.includes(user.role)) return false;
    // Always show Settings & Expenses for authorized roles (not controlled by module toggles)
    if (item.href.startsWith('/settings') || item.href.startsWith('/expenses')) return true;
    // derive module id from href path segment (e.g., '/clients' => 'clients')
    const moduleId = item.href.replace('/', '') || 'dashboard';
    if (!isKnownModule(moduleId)) return false;
    return isModuleEnabled(moduleId);
  });

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
  <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Embassy CRM</h1>
            <p className="text-xs text-muted-foreground">Enterprise System</p>
          </div>
        </div>
        {isSuperAdmin ? (
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Organization</label>
            <select
              className="w-full bg-accent/40 text-xs px-2 py-1 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={currentOrgId || ''}
              onChange={e => switchOrg(e.target.value)}
            >
              {(organizations || []).map(o => (
                <option key={o.id} value={o.id}>{o.name || o.id}</option>
              ))}
            </select>
            {organizations.length === 0 && (
              <p className="text-[10px] text-muted-foreground">No organizations</p>
            )}
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground">
            {organizations[0]?.name || 'Organization'}
          </div>
        )}
      </div>
      
  <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          // Treat any /settings/* path as active for Settings menu entry
          const isSettingsGroup = item.href.startsWith('/settings');
          const isActive = isSettingsGroup
            ? location.pathname.startsWith('/settings')
            : location.pathname === item.href;
          const prefetch = () => {
            // Opportunistic bundle prefetch for route component
            switch (item.href) {
              case '/dashboard': import('@/pages/Dashboard'); break;
              case '/clients': import('@/pages/ClientsPage'); break;
              case '/accounting': import('@/pages/AccountingPage'); break;
              case '/invoices': import('@/pages/InvoicesPage'); break;
              case '/expenses': import('@/pages/ExpensesPage'); break;
              case '/hr': import('@/pages/HRPage'); break;
              case '/documents': import('@/pages/DocumentsPage'); break;
              case '/tasks': import('@/pages/TasksPage'); break;
              case '/reports': import('@/pages/ReportsPage'); break;
              default: break;
            }
          };
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              onMouseEnter={prefetch}
              onFocus={prefetch}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};