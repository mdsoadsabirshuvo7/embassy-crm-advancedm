import { 
  Client, Account, Transaction, Invoice, Employee, Payroll, 
  Document, Attendance, LeaveRequest, Task, Notification,
  TransactionEntry, InvoiceItem, EmergencyContact
} from '../types/database';

// Demo Clients
export const demoClients: Client[] = [
  {
    id: 'client-1',
    orgId: 'demo-org-1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+1-555-0101',
    address: '123 Main St, City, State 12345',
    company: 'Hassan Trading Co.',
    nationality: 'Egyptian',
    passportNumber: 'A123456789',
    visaType: 'Business Visa',
    status: 'active',
    assignedTo: 'demo-user-employee',
    totalBilled: 12500.00,
    totalPaid: 10000.00,
    documents: ['doc-1', 'doc-2'],
    notes: 'VIP client - expedite all requests',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'client-2',
    orgId: 'demo-org-1',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '+1-555-0102',
    address: '456 Oak Ave, City, State 12346',
    company: 'Rodriguez Consulting',
    nationality: 'Mexican',
    passportNumber: 'M987654321',
    visaType: 'Tourist Visa',
    status: 'active',
    assignedTo: 'demo-user-employee',
    totalBilled: 8500.00,
    totalPaid: 8500.00,
    documents: ['doc-3'],
    notes: 'Renewal due next month',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-28')
  },
  {
    id: 'client-3',
    orgId: 'demo-org-1',
    name: 'Chen Wei',
    email: 'chen.wei@email.com',
    phone: '+1-555-0103',
    address: '789 Pine St, City, State 12347',
    company: 'Wei Imports Ltd.',
    nationality: 'Chinese',
    passportNumber: 'C456789123',
    visaType: 'Work Visa',
    status: 'pending',
    assignedTo: 'demo-user-employee',
    totalBilled: 15000.00,
    totalPaid: 7500.00,
    documents: ['doc-4', 'doc-5'],
    notes: 'Awaiting document verification',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-10')
  }
];

// Demo Chart of Accounts
export const demoAccounts: Account[] = [
  // Assets
  {
    id: 'acc-1000',
    orgId: 'demo-org-1',
    code: '1000',
    name: 'Cash in Bank',
    type: 'asset',
    balance: 125000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'acc-1200',
    orgId: 'demo-org-1',
    code: '1200',
    name: 'Accounts Receivable',
    type: 'asset',
    balance: 45000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'acc-1500',
    orgId: 'demo-org-1',
    code: '1500',
    name: 'Office Equipment',
    type: 'asset',
    balance: 25000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  // Liabilities
  {
    id: 'acc-2000',
    orgId: 'demo-org-1',
    code: '2000',
    name: 'Accounts Payable',
    type: 'liability',
    balance: 15000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'acc-2100',
    orgId: 'demo-org-1',
    code: '2100',
    name: 'Accrued Expenses',
    type: 'liability',
    balance: 8500.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  // Equity
  {
    id: 'acc-3000',
    orgId: 'demo-org-1',
    code: '3000',
    name: 'Owner\'s Equity',
    type: 'equity',
    balance: 150000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  // Revenue
  {
    id: 'acc-4000',
    orgId: 'demo-org-1',
    code: '4000',
    name: 'Service Revenue',
    type: 'revenue',
    balance: 180000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'acc-4100',
    orgId: 'demo-org-1',
    code: '4100',
    name: 'Consultation Fees',
    type: 'revenue',
    balance: 25000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  // Expenses
  {
    id: 'acc-5000',
    orgId: 'demo-org-1',
    code: '5000',
    name: 'Salaries Expense',
    type: 'expense',
    balance: 96000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'acc-5100',
    orgId: 'demo-org-1',
    code: '5100',
    name: 'Rent Expense',
    type: 'expense',
    balance: 24000.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'acc-5200',
    orgId: 'demo-org-1',
    code: '5200',
    name: 'Office Supplies',
    type: 'expense',
    balance: 4500.00,
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Demo Transactions
export const demoTransactions: Transaction[] = [
  {
    id: 'txn-1',
    orgId: 'demo-org-1',
    date: new Date('2024-03-01'),
    description: 'Service payment from Ahmed Hassan',
    reference: 'INV-2024-001',
    entries: [
      { accountId: 'acc-1000', debit: 5000.00, credit: 0, description: 'Cash received' },
      { accountId: 'acc-4000', debit: 0, credit: 5000.00, description: 'Service revenue' }
    ],
    status: 'posted',
    createdBy: 'demo-user-accountant',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'txn-2',
    orgId: 'demo-org-1',
    date: new Date('2024-03-05'),
    description: 'Monthly rent payment',
    reference: 'RENT-MAR-2024',
    entries: [
      { accountId: 'acc-5100', debit: 2000.00, credit: 0, description: 'Rent expense' },
      { accountId: 'acc-1000', debit: 0, credit: 2000.00, description: 'Cash paid' }
    ],
    status: 'posted',
    createdBy: 'demo-user-accountant',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  }
];

// Demo Invoices
export const demoInvoices: Invoice[] = [
  {
    id: 'inv-1',
    orgId: 'demo-org-1',
    number: 'INV-2024-001',
    clientId: 'client-1',
    issueDate: new Date('2024-02-15'),
    dueDate: new Date('2024-03-15'),
    items: [
      { description: 'Visa Processing Service', quantity: 1, rate: 4500.00, amount: 4500.00 },
      { description: 'Document Legalization', quantity: 1, rate: 500.00, amount: 500.00 }
    ],
    subtotal: 5000.00,
    tax: 0,
    discount: 0,
    total: 5000.00,
    currency: 'USD',
    status: 'paid',
    paymentTerms: 'Net 30',
    notes: 'Thank you for your business',
    isRecurring: false,
    createdBy: 'demo-user-admin',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'inv-2',
    orgId: 'demo-org-1',
    number: 'INV-2024-002',
    clientId: 'client-2',
    issueDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-31'),
    items: [
      { description: 'Tourist Visa Extension', quantity: 1, rate: 3000.00, amount: 3000.00 },
      { description: 'Consultation Fee', quantity: 2, rate: 250.00, amount: 500.00 }
    ],
    subtotal: 3500.00,
    tax: 350.00,
    discount: 0,
    total: 3850.00,
    currency: 'USD',
    status: 'sent',
    paymentTerms: 'Net 30',
    isRecurring: false,
    createdBy: 'demo-user-admin',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

// Demo Employees
export const demoEmployees: Employee[] = [
  {
    id: 'emp-1',
    orgId: 'demo-org-1',
    userId: 'demo-user-admin',
    employeeId: 'EMP002',
    department: 'Operations',
    position: 'Operations Manager',
    salary: 5500.00,
    currency: 'USD',
    hireDate: new Date('2023-01-15'),
    status: 'active',
    bankAccount: '1234567890',
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Spouse',
      phone: '+1-555-0200'
    },
    benefits: ['Health Insurance', 'Dental Insurance', 'Retirement Plan'],
    documents: ['emp-doc-1'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'emp-2',
    orgId: 'demo-org-1',
    userId: 'demo-user-employee',
    employeeId: 'EMP005',
    department: 'Client Services',
    position: 'Client Relations Specialist',
    salary: 4200.00,
    currency: 'USD',
    hireDate: new Date('2023-06-01'),
    status: 'active',
    bankAccount: '0987654321',
    emergencyContact: {
      name: 'Robert Thompson',
      relationship: 'Father',
      phone: '+1-555-0201'
    },
    benefits: ['Health Insurance', 'Dental Insurance'],
    documents: ['emp-doc-2'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date()
  }
];

// Demo Payroll
export const demoPayroll: Payroll[] = [
  {
    id: 'pay-1',
    orgId: 'demo-org-1',
    employeeId: 'emp-1',
    period: '2024-02',
    basicSalary: 5500.00,
    bonuses: 500.00,
    deductions: 650.00,
    overtime: 200.00,
    grossPay: 6200.00,
    taxes: 1240.00,
    netPay: 4960.00,
    currency: 'USD',
    status: 'paid',
    payDate: new Date('2024-02-28'),
    createdBy: 'demo-user-hr',
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-28')
  },
  {
    id: 'pay-2',
    orgId: 'demo-org-1',
    employeeId: 'emp-2',
    period: '2024-02',
    basicSalary: 4200.00,
    bonuses: 0,
    deductions: 420.00,
    overtime: 150.00,
    grossPay: 4350.00,
    taxes: 870.00,
    netPay: 3480.00,
    currency: 'USD',
    status: 'paid',
    payDate: new Date('2024-02-28'),
    createdBy: 'demo-user-hr',
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-28')
  }
];

// Demo Documents
export const demoDocuments: Document[] = [
  {
    id: 'doc-1',
    orgId: 'demo-org-1',
    name: 'ahmed_hassan_passport.pdf',
    type: 'pdf',
    size: 245760,
    url: '/demo/documents/ahmed_hassan_passport.pdf',
    clientId: 'client-1',
    category: 'passport',
    isTemplate: false,
    uploadedBy: 'demo-user-employee',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'doc-2',
    orgId: 'demo-org-1',
    name: 'business_visa_template.docx',
    type: 'docx',
    size: 125440,
    url: '/demo/templates/business_visa_template.docx',
    category: 'visa',
    isTemplate: true,
    templateData: {
      placeholders: ['{{client_name}}', '{{passport_number}}', '{{issue_date}}']
    },
    uploadedBy: 'demo-user-admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Demo Tasks
export const demoTasks: Task[] = [
  {
    id: 'task-1',
    orgId: 'demo-org-1',
    title: 'Process Ahmed Hassan visa renewal',
    description: 'Complete all documentation and submit to embassy',
    assignedTo: 'demo-user-employee',
    assignedBy: 'demo-user-admin',
    clientId: 'client-1',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date('2024-03-15'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 'task-2',
    orgId: 'demo-org-1',
    title: 'Update client database with new contact information',
    description: 'Ensure all client records have current phone and email',
    assignedTo: 'demo-user-employee',
    assignedBy: 'demo-user-admin',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date('2024-03-20'),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 'task-3',
    orgId: 'demo-org-1',
    title: 'Prepare monthly financial report',
    description: 'Compile P&L and balance sheet for February',
    assignedTo: 'demo-user-accountant',
    assignedBy: 'demo-user-admin',
    priority: 'high',
    status: 'completed',
    dueDate: new Date('2024-03-05'),
    completedAt: new Date('2024-03-04'),
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-03-04')
  }
];

// Demo Attendance
export const demoAttendance: Attendance[] = [
  {
    id: 'att-1',
    orgId: 'demo-org-1',
    employeeId: 'emp-1',
    date: new Date('2024-03-01'),
    clockIn: new Date('2024-03-01T09:00:00'),
    clockOut: new Date('2024-03-01T17:30:00'),
    breakDuration: 60,
    totalHours: 8.0,
    overtime: 0,
    status: 'present',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'att-2',
    orgId: 'demo-org-1',
    employeeId: 'emp-2',
    date: new Date('2024-03-01'),
    clockIn: new Date('2024-03-01T08:45:00'),
    clockOut: new Date('2024-03-01T18:00:00'),
    breakDuration: 45,
    totalHours: 8.75,
    overtime: 0.75,
    status: 'present',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

// Demo Leave Requests
export const demoLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    orgId: 'demo-org-1',
    employeeId: 'emp-1',
    type: 'vacation',
    startDate: new Date('2024-03-25'),
    endDate: new Date('2024-03-29'),
    days: 5,
    reason: 'Family vacation - spring break',
    status: 'approved',
    approvedBy: 'demo-user-hr',
    approvedAt: new Date('2024-03-05'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 'leave-2',
    orgId: 'demo-org-1',
    employeeId: 'emp-2',
    type: 'sick',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-16'),
    days: 2,
    reason: 'Medical appointment and recovery',
    status: 'pending',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  }
];

// Demo Notifications
export const demoNotifications: Notification[] = [
  {
    id: 'notif-1',
    orgId: 'demo-org-1',
    userId: 'demo-user-admin',
    title: 'New client registration',
    message: 'Chen Wei has been added as a new client',
    type: 'info',
    isRead: false,
    data: { clientId: 'client-3' },
    createdAt: new Date('2024-03-10')
  },
  {
    id: 'notif-2',
    orgId: 'demo-org-1',
    userId: 'demo-user-employee',
    title: 'Task deadline approaching',
    message: 'Ahmed Hassan visa renewal due in 5 days',
    type: 'warning',
    isRead: false,
    data: { taskId: 'task-1' },
    createdAt: new Date('2024-03-10')
  },
  {
    id: 'notif-3',
    orgId: 'demo-org-1',
    userId: 'demo-user-hr',
    title: 'Leave request submitted',
    message: 'Jessica Thompson requested sick leave',
    type: 'info',
    isRead: true,
    data: { leaveId: 'leave-2' },
    createdAt: new Date('2024-03-10')
  }
];