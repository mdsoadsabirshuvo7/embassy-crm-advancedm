import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocalStorageService } from '../services/localStorageService';
import { Client, Invoice, Task, Employee, Document, Account, Transaction } from '../types/database';
import { Expense } from '../types/expense';
import { dataSyncManager } from '../utils/dataSync';
import { auditLogger } from '../utils/auditLogger';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface DataContextType {
  // Client data
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Invoice data
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Task data
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Employee data
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Document data
  documents: Document[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  // Expense data
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Account data
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  
  // Transaction data
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Utility functions
  refreshData: () => void;
  exportData: () => any;
  importData: (data: any) => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  const refreshData = () => {
    setClients(LocalStorageService.getClients());
    setInvoices(LocalStorageService.getInvoices());
    setTasks(LocalStorageService.getTasks());
    setEmployees(LocalStorageService.getEmployees());
    setDocuments(LocalStorageService.getDocuments());
    setExpenses(LocalStorageService.getExpenses());
    setAccounts(LocalStorageService.getAccounts());
    setTransactions(LocalStorageService.getTransactions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Client methods
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      LocalStorageService.addClient(clientData);
      refreshData();
      toast({
        title: "Success",
        description: "Client added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
    }
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    try {
      LocalStorageService.updateClient(id, updates);
      refreshData();
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    }
  };

  const deleteClient = (id: string) => {
    try {
      LocalStorageService.deleteClient(id);
      refreshData();
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  // Invoice methods
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      LocalStorageService.addInvoice(invoiceData);
      refreshData();
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    try {
      LocalStorageService.updateInvoice(id, updates);
      refreshData();
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    }
  };

  const deleteInvoice = (id: string) => {
    try {
      LocalStorageService.deleteInvoice(id);
      refreshData();
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  };

  // Task methods
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      LocalStorageService.addTask(taskData);
      refreshData();
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    try {
      LocalStorageService.updateTask(id, updates);
      refreshData();
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = (id: string) => {
    try {
      LocalStorageService.deleteTask(id);
      refreshData();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  // Employee methods
  const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      LocalStorageService.addEmployee(employeeData);
      refreshData();
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    try {
      LocalStorageService.updateEmployee(id, updates);
      refreshData();
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = (id: string) => {
    try {
      LocalStorageService.deleteEmployee(id);
      refreshData();
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    }
  };

  // Document methods
  const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      LocalStorageService.addDocument(documentData);
      refreshData();
      toast({
        title: "Success",
        description: "Document added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add document",
        variant: "destructive",
      });
    }
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    try {
      LocalStorageService.updateDocument(id, updates);
      refreshData();
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    }
  };

  const deleteDocument = (id: string) => {
    try {
      LocalStorageService.deleteDocument(id);
      refreshData();
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  // Expense methods
  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const expense = LocalStorageService.addExpense(expenseData);
      
      // Sync with offline storage
      if (user) {
        await dataSyncManager.storeData(
          'expenses',
          expense,
          () => {}, // LocalStorageService already called
          user.id,
          user.name
        );
      }
      
      refreshData();
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const oldExpense = expenses.find(e => e.id === id);
      LocalStorageService.updateExpense(id, updates);
      
      // Log the update
      if (user && oldExpense) {
        await auditLogger.logUpdate(
          user.id,
          user.name,
          'expenses',
          id,
          oldExpense,
          { ...oldExpense, ...updates }
        );
      }
      
      refreshData();
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const expense = expenses.find(e => e.id === id);
      LocalStorageService.deleteExpense(id);
      
      // Log the deletion
      if (user && expense) {
        await auditLogger.logDelete(
          user.id,
          user.name,
          'expenses',
          id,
          expense
        );
      }
      
      refreshData();
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  // Account methods
  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      LocalStorageService.addAccount(accountData);
      refreshData();
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    try {
      LocalStorageService.updateAccount(id, updates);
      refreshData();
      toast({
        title: "Success",
        description: "Account updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account",
        variant: "destructive",
      });
    }
  };

  // Transaction methods
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      LocalStorageService.addTransaction(transactionData);
      refreshData();
      toast({
        title: "Success",
        description: "Transaction recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record transaction",
        variant: "destructive",
      });
    }
  };

  // Utility methods
  const exportData = () => {
    return LocalStorageService.exportAllData();
  };

  const importData = (data: any) => {
    try {
      LocalStorageService.importData(data);
      refreshData();
      toast({
        title: "Success",
        description: "Data imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      });
    }
  };

  const clearAllData = () => {
    try {
      LocalStorageService.clearAllData();
      refreshData();
      toast({
        title: "Success",
        description: "All data cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data",
        variant: "destructive",
      });
    }
  };

  return (
    <DataContext.Provider value={{
      clients, addClient, updateClient, deleteClient,
      invoices, addInvoice, updateInvoice, deleteInvoice,
      tasks, addTask, updateTask, deleteTask,
      employees, addEmployee, updateEmployee, deleteEmployee,
      documents, addDocument, updateDocument, deleteDocument,
      expenses, addExpense, updateExpense, deleteExpense,
      accounts, addAccount, updateAccount,
      transactions, addTransaction,
      refreshData, exportData, importData, clearAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};