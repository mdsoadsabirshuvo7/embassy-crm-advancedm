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

  // Schema versioning
  private static readonly SCHEMA_VERSION_KEY = 'crm_schema_version';
  private static readonly CURRENT_VERSION = 2; // Increment when structure changes

  private static getStoredVersion(): number {
    const v = localStorage.getItem(this.SCHEMA_VERSION_KEY);
    return v ? parseInt(v, 10) : 0;
  }

  private static setStoredVersion(v: number) {
    localStorage.setItem(this.SCHEMA_VERSION_KEY, String(v));
  }

  static runMigrationsInternal(): void {
    const from = this.getStoredVersion();
    if (from >= this.CURRENT_VERSION) return; // Up to date

    // Simple linear migrations; each case upgrades one version
    for (let v = from + 1; v <= this.CURRENT_VERSION; v++) {
      try {
        switch (v) {
          case 1:
            // Initial baseline (no-op)
            break;
          case 2: {
            // Ensure expenses array exists & normalize date string fields
            const expenses = this.getExpenses();
            const normalized = expenses.map(e => ({
              ...e,
              date: typeof e.date === 'string' ? e.date : new Date(e.date as unknown as string).toISOString().split('T')[0]
            }));
            this.saveExpenses(normalized);
            break;
          }
          default:
            break;
        }
        this.setStoredVersion(v);
      } catch (err) {
        console.error('Migration failed for version', v, err);
        break; // Stop further migrations to prevent cascading issues
      }
    }
  }

  // Generic methods
  private static tenantKey(base: string, orgId?: string | null) {
    return orgId ? `${base}__org__${orgId}` : base;
  }

  private static activeOrg(): string | null {
    try { return localStorage.getItem('activeOrgId'); } catch { return null; }
  }

  private static migrateIfNeeded(baseKey: string) {
    // If namespaced key missing but base key exists, perform one-time migration splitting by orgId.
    const orgId = this.activeOrg();
    if (!orgId) return; // nothing to do without active org
    const namespaced = this.tenantKey(baseKey, orgId);
    if (localStorage.getItem(namespaced)) return; // already migrated for this org
    const legacyRaw = localStorage.getItem(baseKey);
    if (!legacyRaw) return;
    try {
      const arr: unknown = JSON.parse(legacyRaw);
      if (Array.isArray(arr)) {
        const filtered = arr.filter((item: unknown) => {
          if (!item || typeof item !== 'object') return true;
          const rec = item as { orgId?: string };
          return !rec.orgId || rec.orgId === orgId;
        });
        localStorage.setItem(namespaced, JSON.stringify(filtered));
      }
    // Do not delete legacy to allow other org migrations later
    } catch { /* ignore */ }
  }

  private static get<T>(key: string, orgScoped = true): T[] {
    try {
      const orgId = this.activeOrg();
      if (orgScoped) this.migrateIfNeeded(key);
      const data = localStorage.getItem(orgScoped ? this.tenantKey(key, orgId) : key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return [];
    }
  }

  private static set<T>(key: string, data: T[], orgScoped = true): void {
    try {
      const orgId = this.activeOrg();
      localStorage.setItem(orgScoped ? this.tenantKey(key, orgId) : key, JSON.stringify(data));
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
    return this.get<Client>(this.KEYS.CLIENTS).filter(c => !c.orgId || c.orgId === this.activeOrg());
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
  if (!newClient.orgId) (newClient as Client).orgId = this.activeOrg() || 'global';
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
    return this.get<Invoice>(this.KEYS.INVOICES).filter(i => !i.orgId || i.orgId === this.activeOrg());
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
  if (!newInvoice.orgId) (newInvoice as Invoice).orgId = this.activeOrg() || 'global';
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
    return this.get<Task>(this.KEYS.TASKS).filter(t => !t.orgId || t.orgId === this.activeOrg());
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
  if (!newTask.orgId) (newTask as Task).orgId = this.activeOrg() || 'global';
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
    return this.get<Employee>(this.KEYS.EMPLOYEES).filter(e => !e.orgId || e.orgId === this.activeOrg());
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
  if (!newEmployee.orgId) (newEmployee as Employee).orgId = this.activeOrg() || 'global';
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
    return this.get<Document>(this.KEYS.DOCUMENTS).filter(d => !d.orgId || d.orgId === this.activeOrg());
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
  if (!newDocument.orgId) (newDocument as Document).orgId = this.activeOrg() || 'global';
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
    return this.get<Expense>(this.KEYS.EXPENSES).filter(e => !e.orgId || e.orgId === this.activeOrg());
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
  if (!newExpense.orgId) (newExpense as Expense).orgId = this.activeOrg() || 'global';
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
    return this.get<Account>(this.KEYS.ACCOUNTS).filter(a => !a.orgId || a.orgId === this.activeOrg());
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
  if (!newAccount.orgId) (newAccount as Account).orgId = this.activeOrg() || 'global';
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
    return this.get<Transaction>(this.KEYS.TRANSACTIONS).filter(tx => !tx.orgId || tx.orgId === this.activeOrg());
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
  if (!newTransaction.orgId) (newTransaction as Transaction).orgId = this.activeOrg() || 'global';
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
  static exportAllData() {
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
    } as const;
  }

  // Import data
  static importData(data: { clients?: unknown; invoices?: unknown; tasks?: unknown; employees?: unknown; documents?: unknown; expenses?: unknown; accounts?: unknown; transactions?: unknown; }): void {
    if (Array.isArray(data.clients)) this.saveClients(data.clients as Client[]);
    if (Array.isArray(data.invoices)) this.saveInvoices(data.invoices as Invoice[]);
    if (Array.isArray(data.tasks)) this.saveTasks(data.tasks as Task[]);
    if (Array.isArray(data.employees)) this.saveEmployees(data.employees as Employee[]);
    if (Array.isArray(data.documents)) this.saveDocuments(data.documents as Document[]);
    if (Array.isArray(data.expenses)) this.saveExpenses(data.expenses as Expense[]);
    if (Array.isArray(data.accounts)) this.saveAccounts(data.accounts as Account[]);
    if (Array.isArray(data.transactions)) this.saveTransactions(data.transactions as Transaction[]);
  }
}

// Initialize with demo data on first load
LocalStorageService.initializeWithDemoData();
// Run migrations after potential demo init
// Public migration trigger (idempotent)
export const migrateLocalStorageSchema = () => LocalStorageService.runMigrationsInternal();
migrateLocalStorageSchema();