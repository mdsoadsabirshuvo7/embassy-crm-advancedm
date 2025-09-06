export interface Expense {
  id: string;
  orgId: string;
  description: string;
  amount: number;
  currency: 'BDT' | 'USD';
  category: string;
  subcategory?: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'cheque';
  vendor: string;
  receipt?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  submittedBy: {
    id: string;
    name: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
  project?: string;
  billable: boolean;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollData {
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