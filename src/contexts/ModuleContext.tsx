import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModuleName = 
  | 'dashboard' 
  | 'clients' 
  | 'accounting' 
  | 'hr' 
  | 'documents' 
  | 'tasks' 
  | 'reports' 
  | 'invoices' 
  | 'expenses';

interface ModuleConfig {
  id: ModuleName;
  name: string;
  description: string;
  enabled: boolean;
  requiredRole?: string[];
  icon: string;
  category: 'core' | 'business' | 'advanced';
}

interface ModuleContextType {
  modules: ModuleConfig[];
  enabledModules: ModuleName[];
  toggleModule: (moduleId: ModuleName) => void;
  isModuleEnabled: (moduleId: ModuleName) => boolean;
  getModulesByCategory: (category: string) => ModuleConfig[];
}

const defaultModules: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview and analytics',
    enabled: true,
    icon: 'LayoutDashboard',
    category: 'core'
  },
  {
    id: 'clients',
    name: 'Client Management',
    description: 'Manage clients and contacts',
    enabled: true,
    icon: 'Users',
    category: 'core'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Financial management and bookkeeping',
    enabled: true,
    requiredRole: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'],
    icon: 'Calculator',
    category: 'business'
  },
  {
    id: 'hr',
    name: 'Human Resources',
    description: 'Employee management and payroll',
    enabled: true,
    requiredRole: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'],
    icon: 'UserCheck',
    category: 'business'
  },
  {
    id: 'documents',
    name: 'Document Management',
    description: 'File storage and document templates',
    enabled: true,
    icon: 'FileText',
    category: 'core'
  },
  {
    id: 'tasks',
    name: 'Task Management',
    description: 'Project tracking and assignments',
    enabled: true,
    icon: 'CheckSquare',
    category: 'core'
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Custom reports and data analysis',
    enabled: true,
    requiredRole: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'HR_MANAGER'],
    icon: 'BarChart3',
    category: 'advanced'
  },
  {
    id: 'invoices',
    name: 'Invoicing',
    description: 'Create and manage invoices',
    enabled: true,
    icon: 'Receipt',
    category: 'business'
  },
  {
    id: 'expenses',
    name: 'Expense Management',
    description: 'Track and categorize expenses',
    enabled: false,
    icon: 'CreditCard',
    category: 'business'
  }
];

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleConfig[]>(() => {
    const saved = localStorage.getItem('moduleConfig');
    if (saved) {
      const savedModules = JSON.parse(saved);
      // Merge with defaults to handle new modules
      return defaultModules.map(defaultModule => {
        const savedModule = savedModules.find((m: ModuleConfig) => m.id === defaultModule.id);
        return savedModule ? { ...defaultModule, enabled: savedModule.enabled } : defaultModule;
      });
    }
    return defaultModules;
  });

  const enabledModules = modules.filter(m => m.enabled).map(m => m.id);

  const toggleModule = (moduleId: ModuleName) => {
    setModules(prev => {
      const updated = prev.map(module => 
        module.id === moduleId 
          ? { ...module, enabled: !module.enabled }
          : module
      );
      
      // Save to localStorage
      localStorage.setItem('moduleConfig', JSON.stringify(updated));
      
      return updated;
    });
  };

  const isModuleEnabled = (moduleId: ModuleName): boolean => {
    return modules.find(m => m.id === moduleId)?.enabled || false;
  };

  const getModulesByCategory = (category: string): ModuleConfig[] => {
    return modules.filter(m => m.category === category);
  };

  useEffect(() => {
    // Save to localStorage whenever modules change
    localStorage.setItem('moduleConfig', JSON.stringify(modules));
  }, [modules]);

  return (
    <ModuleContext.Provider value={{
      modules,
      enabledModules,
      toggleModule,
      isModuleEnabled,
      getModulesByCategory
    }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};