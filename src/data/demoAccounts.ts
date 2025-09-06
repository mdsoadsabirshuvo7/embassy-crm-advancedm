import { User, Organization } from '../types/database';

// Demo Organization
export const demoOrganization: Organization = {
  id: 'demo-org-1',
  name: 'Global Embassy Services Ltd.',
  subdomain: 'global-embassy',
  logo: '',
  letterhead: '',
  stamp: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  address: '123 Embassy Street, Diplomatic Quarter, Capital City',
  phone: '+1-555-EMBASSY',
  email: 'info@globalembassy.com',
  website: 'https://globalembassy.com',
  currency: 'USD',
  language: 'en',
  timezone: 'UTC',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

// Demo Users with different roles
export const demoUsers: User[] = [
  {
    id: 'demo-user-super-admin',
    orgId: 'demo-org-1',
    email: 'superadmin@demo.com',
    name: 'Sarah Wilson',
    role: 'SUPER_ADMIN',
    avatar: '',
    department: 'Administration',
    employeeId: 'EMP001',
    isActive: true,
    permissions: [
      'manage_users', 'manage_clients', 'manage_accounting', 'manage_hr',
      'manage_settings', 'view_reports', 'manage_documents', 'manage_tasks'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'demo-user-admin',
    orgId: 'demo-org-1',
    email: 'admin@demo.com',
    name: 'Michael Chen',
    role: 'ADMIN',
    avatar: '',
    department: 'Operations',
    employeeId: 'EMP002',
    isActive: true,
    permissions: [
      'manage_clients', 'manage_accounting', 'manage_hr',
      'view_reports', 'manage_documents', 'manage_tasks'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'demo-user-accountant',
    orgId: 'demo-org-1',
    email: 'accountant@demo.com',
    name: 'Emily Rodriguez',
    role: 'ACCOUNTANT',
    avatar: '',
    department: 'Finance',
    employeeId: 'EMP003',
    isActive: true,
    permissions: [
      'manage_accounting', 'view_financial_reports', 'manage_invoices',
      'manage_expenses', 'view_clients'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'demo-user-hr',
    orgId: 'demo-org-1',
    email: 'hr@demo.com',
    name: 'David Kim',
    role: 'HR_MANAGER',
    avatar: '',
    department: 'Human Resources',
    employeeId: 'EMP004',
    isActive: true,
    permissions: [
      'manage_hr', 'manage_payroll', 'view_hr_reports', 'manage_employees',
      'manage_attendance', 'manage_leave'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'demo-user-employee',
    orgId: 'demo-org-1',
    email: 'employee@demo.com',
    name: 'Jessica Thompson',
    role: 'EMPLOYEE',
    avatar: '',
    department: 'Client Services',
    employeeId: 'EMP005',
    isActive: true,
    permissions: [
      'view_clients', 'manage_tasks', 'view_own_hr', 'submit_expenses'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Demo Account Credentials
export const demoCredentials = {
  'superadmin@demo.com': 'demo123',
  'admin@demo.com': 'demo123',
  'accountant@demo.com': 'demo123',
  'hr@demo.com': 'demo123',
  'employee@demo.com': 'demo123'
};

// Helper function to get demo user
export const getDemoUser = (email: string): User | null => {
  return demoUsers.find(user => user.email === email) || null;
};

// Helper function to validate demo credentials
export const validateDemoCredentials = (email: string, password: string): boolean => {
  return demoCredentials[email as keyof typeof demoCredentials] === password;
};