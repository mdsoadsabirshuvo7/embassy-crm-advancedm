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
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Embassy CRM</h1>
            <p className="text-xs text-muted-foreground">Enterprise System</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
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