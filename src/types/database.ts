export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ACCOUNTANT' | 'HR_MANAGER' | 'EMPLOYEE' | 'CLIENT';

export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  letterhead?: string;
  stamp?: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  currency: 'BDT' | 'USD';
  language: 'en' | 'bn';
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  orgId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  employeeId?: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  nationality: string;
  passportNumber?: string;
  visaType?: string;
  status: 'active' | 'inactive' | 'pending';
  assignedTo: string; // Employee ID
  totalBilled: number;
  totalPaid: number;
  documents: string[]; // Document IDs
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  orgId: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: string;
  balance: number;
  currency: 'BDT' | 'USD';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  orgId: string;
  date: Date;
  description: string;
  reference?: string;
  entries: TransactionEntry[];
  status: 'draft' | 'posted';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionEntry {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface Invoice {
  id: string;
  orgId: string;
  number: string;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: 'BDT' | 'USD';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Employee {
  id: string;
  orgId: string;
  userId: string;
  employeeId: string;
  department: string;
  position: string;
  salary: number;
  currency: 'BDT' | 'USD';
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  bankAccount?: string;
  emergencyContact?: EmergencyContact;
  benefits: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Payroll {
  id: string;
  orgId: string;
  employeeId: string;
  period: string; // YYYY-MM
  basicSalary: number;
  bonuses: number;
  deductions: number;
  overtime: number;
  grossPay: number;
  taxes: number;
  netPay: number;
  currency: 'BDT' | 'USD';
  status: 'draft' | 'approved' | 'paid';
  payDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  orgId: string;
  name: string;
  type: 'pdf' | 'docx' | 'jpg' | 'png';
  size: number;
  url: string;
  clientId?: string;
  employeeId?: string;
  category: 'passport' | 'visa' | 'certificate' | 'contract' | 'invoice' | 'payslip' | 'other';
  isTemplate: boolean;
  templateData?: Record<string, unknown> | null;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  orgId: string;
  employeeId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  breakDuration: number; // minutes
  totalHours: number;
  overtime: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveRequest {
  id: string;
  orgId: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  orgId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  clientId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  orgId: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  isEnabled: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface Department {
  id: string;
  orgId: string;
  name: string;
  description: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget: number;
  employeeCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  id: string;
  orgId: string;
  googleDrive: GoogleDriveConfig;
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
  };
  payrollSettings: {
    taxRates: Record<string, number>;
    benefits: string[];
    deductions: string[];
  };
  invoiceSettings: {
    prefix: string;
    startNumber: number;
    terms: string;
    footer: string;
  };
  updatedAt: Date;
}