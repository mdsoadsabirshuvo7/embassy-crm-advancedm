import { Client, Account, Transaction, Invoice, Employee, Payroll, Document, Task, Attendance, LeaveRequest, Notification } from '../types/database';
import { Expense } from '../types/expense';

export class LocalStorageService {
  private static readonly KEYS = {
    CLIENTS: 'crm_clients',
    ACCOUNTS: 'crm_accounts',
    TRANSACTIONS: 'crm_transactions',
    INVOICES: 'crm_invoices',
    EMPLOYEES: 'crm_employees',
    PAYROLL: 'crm_payroll',
    DOCUMENTS: 'crm_documents',
    TASKS: 'crm_tasks',
    ATTENDANCE: 'crm_attendance',
    LEAVE_REQUESTS: 'crm_leave_requests',
    NOTIFICATIONS: 'crm_notifications',
    EXPENSES: 'crm_expenses',
    LAST_SYNC: 'crm_last_sync'
  };

  // Generic methods
  private static get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return [];
    }
  }

  private static set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(this.KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  private static generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Client methods
  static getClients(): Client[] {
    return this.get<Client>(this.KEYS.CLIENTS);
  }

  static saveClients(clients: Client[]): void {
    this.set(this.KEYS.CLIENTS, clients);
  }

  static addClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const clients = this.getClients();
    const newClient: Client = {
      ...clientData,
      id: this.generateId('client'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    clients.push(newClient);
    this.saveClients(clients);
    return newClient;
  }

  static updateClient(clientId: string, updates: Partial<Client>): void {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates, updatedAt: new Date() };
      this.saveClients(clients);
    }
  }

  static deleteClient(clientId: string): void {
    const clients = this.getClients().filter(c => c.id !== clientId);
    this.saveClients(clients);
  }

  // Invoice methods
  static getInvoices(): Invoice[] {
    return this.get<Invoice>(this.KEYS.INVOICES);
  }

  static saveInvoices(invoices: Invoice[]): void {
    this.set(this.KEYS.INVOICES, invoices);
  }

  static addInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice {
    const invoices = this.getInvoices();
    const newInvoice: Invoice = {
      ...invoiceData,
      id: this.generateId('inv'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    invoices.push(newInvoice);
    this.saveInvoices(invoices);
    return newInvoice;
  }

  static updateInvoice(invoiceId: string, updates: Partial<Invoice>): void {
    const invoices = this.getInvoices();
    const index = invoices.findIndex(i => i.id === invoiceId);
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...updates, updatedAt: new Date() };
      this.saveInvoices(invoices);
    }
  }

  static deleteInvoice(invoiceId: string): void {
    const invoices = this.getInvoices().filter(i => i.id !== invoiceId);
    this.saveInvoices(invoices);
  }

  // Task methods
  static getTasks(): Task[] {
    return this.get<Task>(this.KEYS.TASKS);
  }

  static saveTasks(tasks: Task[]): void {
    this.set(this.KEYS.TASKS, tasks);
  }

  static addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: this.generateId('task'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  static updateTask(taskId: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
      this.saveTasks(tasks);
    }
  }

  static deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  }

  // Employee methods
  static getEmployees(): Employee[] {
    return this.get<Employee>(this.KEYS.EMPLOYEES);
  }

  static saveEmployees(employees: Employee[]): void {
    this.set(this.KEYS.EMPLOYEES, employees);
  }

  static addEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee {
    const employees = this.getEmployees();
    const newEmployee: Employee = {
      ...employeeData,
      id: this.generateId('emp'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    employees.push(newEmployee);
    this.saveEmployees(employees);
    return newEmployee;
  }

  static updateEmployee(employeeId: string, updates: Partial<Employee>): void {
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.id === employeeId);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...updates, updatedAt: new Date() };
      this.saveEmployees(employees);
    }
  }

  static deleteEmployee(employeeId: string): void {
    const employees = this.getEmployees().filter(e => e.id !== employeeId);
    this.saveEmployees(employees);
  }

  // Document methods
  static getDocuments(): Document[] {
    return this.get<Document>(this.KEYS.DOCUMENTS);
  }

  static saveDocuments(documents: Document[]): void {
    this.set(this.KEYS.DOCUMENTS, documents);
  }

  static addDocument(documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Document {
    const documents = this.getDocuments();
    const newDocument: Document = {
      ...documentData,
      id: this.generateId('doc'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    documents.push(newDocument);
    this.saveDocuments(documents);
    return newDocument;
  }

  static updateDocument(documentId: string, updates: Partial<Document>): void {
    const documents = this.getDocuments();
    const index = documents.findIndex(d => d.id === documentId);
    if (index !== -1) {
      documents[index] = { ...documents[index], ...updates, updatedAt: new Date() };
      this.saveDocuments(documents);
    }
  }

  static deleteDocument(documentId: string): void {
    const documents = this.getDocuments().filter(d => d.id !== documentId);
    this.saveDocuments(documents);
  }

  // Expense methods
  static getExpenses(): Expense[] {
    return this.get<Expense>(this.KEYS.EXPENSES);
  }

  static saveExpenses(expenses: Expense[]): void {
    this.set(this.KEYS.EXPENSES, expenses);
  }

  static addExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
    const expenses = this.getExpenses();
    const newExpense: Expense = {
      ...expenseData,
      id: this.generateId('exp'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    expenses.push(newExpense);
    this.saveExpenses(expenses);
    return newExpense;
  }

  static updateExpense(expenseId: string, updates: Partial<Expense>): void {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(e => e.id === expenseId);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates, updatedAt: new Date() };
      this.saveExpenses(expenses);
    }
  }

  static deleteExpense(expenseId: string): void {
    const expenses = this.getExpenses().filter(e => e.id !== expenseId);
    this.saveExpenses(expenses);
  }

  // Account methods
  static getAccounts(): Account[] {
    return this.get<Account>(this.KEYS.ACCOUNTS);
  }

  static saveAccounts(accounts: Account[]): void {
    this.set(this.KEYS.ACCOUNTS, accounts);
  }

  static addAccount(accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Account {
    const accounts = this.getAccounts();
    const newAccount: Account = {
      ...accountData,
      id: this.generateId('acc'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    accounts.push(newAccount);
    this.saveAccounts(accounts);
    return newAccount;
  }

  static updateAccount(accountId: string, updates: Partial<Account>): void {
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates, updatedAt: new Date() };
      this.saveAccounts(accounts);
    }
  }

  // Transaction methods
  static getTransactions(): Transaction[] {
    return this.get<Transaction>(this.KEYS.TRANSACTIONS);
  }

  static saveTransactions(transactions: Transaction[]): void {
    this.set(this.KEYS.TRANSACTIONS, transactions);
  }

  static addTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transactionData,
      id: this.generateId('txn'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  // Initialize with demo data if empty
  static initializeWithDemoData(): void {
    if (this.getClients().length === 0) {
      // Import demo data and initialize
      import('../data/demoData').then(({ 
        demoClients, demoAccounts, demoTransactions, demoInvoices, 
        demoEmployees, demoDocuments, demoTasks 
      }) => {
        this.saveClients(demoClients);
        this.saveAccounts(demoAccounts);
        this.saveTransactions(demoTransactions);
        this.saveInvoices(demoInvoices);
        this.saveEmployees(demoEmployees);
        this.saveDocuments(demoDocuments);
        this.saveTasks(demoTasks);
      });
    }
  }

  // Clear all data
  static clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Export all data
  static exportAllData(): any {
    return {
      clients: this.getClients(),
      invoices: this.getInvoices(),
      tasks: this.getTasks(),
      employees: this.getEmployees(),
      documents: this.getDocuments(),
      expenses: this.getExpenses(),
      accounts: this.getAccounts(),
      transactions: this.getTransactions(),
      exportedAt: new Date().toISOString()
    };
  }

  // Import data
  static importData(data: any): void {
    if (data.clients) this.saveClients(data.clients);
    if (data.invoices) this.saveInvoices(data.invoices);
    if (data.tasks) this.saveTasks(data.tasks);
    if (data.employees) this.saveEmployees(data.employees);
    if (data.documents) this.saveDocuments(data.documents);
    if (data.expenses) this.saveExpenses(data.expenses);
    if (data.accounts) this.saveAccounts(data.accounts);
    if (data.transactions) this.saveTransactions(data.transactions);
  }
}

// Initialize with demo data on first load
LocalStorageService.initializeWithDemoData();