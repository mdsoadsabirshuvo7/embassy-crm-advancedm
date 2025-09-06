// Mock service to provide demo data for demo accounts
import { 
  demoClients, demoAccounts, demoTransactions, demoInvoices, 
  demoEmployees, demoPayroll, demoDocuments, demoTasks, 
  demoAttendance, demoLeaveRequests, demoNotifications 
} from '../data/demoData';
import { 
  Client, Account, Transaction, Invoice, Employee, Payroll,
  Document, Task, Attendance, LeaveRequest, Notification
} from '../types/database';

export class MockDataService {
  // Check if current user is a demo user
  static isDemoUser(): boolean {
    return localStorage.getItem('demoUser') !== null;
  }

  // Client Service Mock Methods
  static async getMockClients(): Promise<Client[]> {
    return [...demoClients];
  }

  static async getMockClient(clientId: string): Promise<Client | null> {
    return demoClients.find(client => client.id === clientId) || null;
  }

  static async createMockClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoClients.push(newClient);
    return newClient;
  }

  static async updateMockClient(clientId: string, updates: Partial<Client>): Promise<void> {
    const index = demoClients.findIndex(client => client.id === clientId);
    if (index !== -1) {
      demoClients[index] = { ...demoClients[index], ...updates, updatedAt: new Date() };
    }
  }

  static async deleteMockClient(clientId: string): Promise<void> {
    const index = demoClients.findIndex(client => client.id === clientId);
    if (index !== -1) {
      demoClients.splice(index, 1);
    }
  }

  // Account Service Mock Methods
  static async getMockAccounts(): Promise<Account[]> {
    return [...demoAccounts];
  }

  static async getMockAccount(accountId: string): Promise<Account | null> {
    return demoAccounts.find(account => account.id === accountId) || null;
  }

  static async createMockAccount(accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const newAccount: Account = {
      ...accountData,
      id: `acc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoAccounts.push(newAccount);
    return newAccount;
  }

  // Transaction Service Mock Methods
  static async getMockTransactions(): Promise<Transaction[]> {
    return [...demoTransactions];
  }

  static async createMockTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `txn-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoTransactions.push(newTransaction);
    return newTransaction;
  }

  // Invoice Service Mock Methods
  static async getMockInvoices(): Promise<Invoice[]> {
    return [...demoInvoices];
  }

  static async getMockInvoice(invoiceId: string): Promise<Invoice | null> {
    return demoInvoices.find(invoice => invoice.id === invoiceId) || null;
  }

  static async createMockInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoInvoices.push(newInvoice);
    return newInvoice;
  }

  // Employee Service Mock Methods
  static async getMockEmployees(): Promise<Employee[]> {
    return [...demoEmployees];
  }

  static async getMockEmployee(employeeId: string): Promise<Employee | null> {
    return demoEmployees.find(employee => employee.id === employeeId) || null;
  }

  // Payroll Service Mock Methods
  static async getMockPayroll(): Promise<Payroll[]> {
    return [...demoPayroll];
  }

  static async getMockPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return demoPayroll.filter(payroll => payroll.employeeId === employeeId);
  }

  static async createMockPayroll(payrollData: Omit<Payroll, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payroll> {
    const newPayroll: Payroll = {
      ...payrollData,
      id: `pay-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoPayroll.push(newPayroll);
    return newPayroll;
  }

  // Document Service Mock Methods
  static async getMockDocuments(): Promise<Document[]> {
    return [...demoDocuments];
  }

  static async getMockDocumentsByClient(clientId: string): Promise<Document[]> {
    return demoDocuments.filter(doc => doc.clientId === clientId);
  }

  static async getMockTemplates(): Promise<Document[]> {
    return demoDocuments.filter(doc => doc.isTemplate);
  }

  // Task Service Mock Methods
  static async getMockTasks(): Promise<Task[]> {
    return [...demoTasks];
  }

  static async getMockTasksByUser(userId: string): Promise<Task[]> {
    return demoTasks.filter(task => task.assignedTo === userId);
  }

  static async createMockTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoTasks.push(newTask);
    return newTask;
  }

  static async updateMockTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const index = demoTasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      demoTasks[index] = { ...demoTasks[index], ...updates, updatedAt: new Date() };
    }
  }

  // Attendance Service Mock Methods
  static async getMockAttendance(): Promise<Attendance[]> {
    return [...demoAttendance];
  }

  static async getMockAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    return demoAttendance.filter(att => att.employeeId === employeeId);
  }

  // Leave Service Mock Methods
  static async getMockLeaveRequests(): Promise<LeaveRequest[]> {
    return [...demoLeaveRequests];
  }

  static async getMockLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return demoLeaveRequests.filter(leave => leave.employeeId === employeeId);
  }

  static async createMockLeaveRequest(leaveData: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeaveRequest> {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `leave-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoLeaveRequests.push(newLeave);
    return newLeave;
  }

  // Notification Service Mock Methods
  static async getMockNotifications(userId: string): Promise<Notification[]> {
    return demoNotifications.filter(notif => notif.userId === userId);
  }

  static async markMockNotificationRead(notificationId: string): Promise<void> {
    const notification = demoNotifications.find(notif => notif.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  // Dashboard Statistics Mock Methods
  static async getMockDashboardStats() {
    const totalClients = demoClients.length;
    const activeClients = demoClients.filter(c => c.status === 'active').length;
    const pendingClients = demoClients.filter(c => c.status === 'pending').length;
    const totalRevenue = demoInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidInvoices = demoInvoices.filter(inv => inv.status === 'paid').length;
    const totalInvoices = demoInvoices.length;
    const activeTasks = demoTasks.filter(t => t.status !== 'completed').length;
    const completedTasks = demoTasks.filter(t => t.status === 'completed').length;

    return {
      clients: {
        total: totalClients,
        active: activeClients,
        pending: pendingClients,
        growth: '+12%'
      },
      revenue: {
        total: totalRevenue,
        monthly: totalRevenue * 0.15, // Mock monthly revenue
        growth: '+8.5%'
      },
      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
        pending: totalInvoices - paidInvoices,
        overdue: 1
      },
      tasks: {
        total: activeTasks + completedTasks,
        active: activeTasks,
        completed: completedTasks,
        overdue: 1
      },
      employees: {
        total: demoEmployees.length,
        active: demoEmployees.filter(e => e.status === 'active').length,
        onLeave: 1
      }
    };
  }

  // Financial Reports Mock Methods
  static async getMockTrialBalance() {
    return demoAccounts.map(account => ({
      accountCode: account.code,
      accountName: account.name,
      debit: account.type === 'asset' || account.type === 'expense' ? account.balance : 0,
      credit: account.type === 'liability' || account.type === 'equity' || account.type === 'revenue' ? account.balance : 0
    }));
  }

  static async getMockProfitLoss() {
    const revenues = demoAccounts.filter(acc => acc.type === 'revenue');
    const expenses = demoAccounts.filter(acc => acc.type === 'expense');
    
    const totalRevenue = revenues.reduce((sum, acc) => sum + acc.balance, 0);
    const totalExpenses = expenses.reduce((sum, acc) => sum + acc.balance, 0);
    
    return {
      revenues: revenues.map(acc => ({ name: acc.name, amount: acc.balance })),
      expenses: expenses.map(acc => ({ name: acc.name, amount: acc.balance })),
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses
    };
  }

  static async getMockBalanceSheet() {
    const assets = demoAccounts.filter(acc => acc.type === 'asset');
    const liabilities = demoAccounts.filter(acc => acc.type === 'liability');
    const equity = demoAccounts.filter(acc => acc.type === 'equity');
    
    const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
    const totalEquity = equity.reduce((sum, acc) => sum + acc.balance, 0);
    
    return {
      assets: assets.map(acc => ({ name: acc.name, amount: acc.balance })),
      liabilities: liabilities.map(acc => ({ name: acc.name, amount: acc.balance })),
      equity: equity.map(acc => ({ name: acc.name, amount: acc.balance })),
      totalAssets,
      totalLiabilities,
      totalEquity
    };
  }
}