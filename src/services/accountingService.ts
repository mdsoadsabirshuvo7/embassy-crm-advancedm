import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Account, Transaction, TransactionEntry, Invoice, InvoiceItem } from '../types/database';
import apiClient from './apiClient';

export class AccountingService {
  // Chart of Accounts Management
  static async createAccount(accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const docRef = await addDoc(collection(db, 'accounts'), {
      ...accountData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...accountData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async getAccountsByOrganization(orgId: string): Promise<Account[]> {
    const q = query(
      collection(db, 'accounts'),
      where('orgId', '==', orgId),
      where('isActive', '==', true),
      orderBy('code')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Account));
  }

  static async updateAccount(accountId: string, updates: Partial<Account>): Promise<void> {
    await updateDoc(doc(db, 'accounts', accountId), {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Double-Entry Transaction Management
  static async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    // If API backend configured, delegate to REST endpoint (journal create maps to transaction)
    if (apiClient.isEnabled()) {
      // Map entries shape to backend expectation (accountCode vs accountId may differ in future)
      const payload = {
        date: transactionData.date,
        ref: transactionData.reference || `TX-${Date.now()}`,
        memo: transactionData.description,
        lines: transactionData.entries.map(e => ({
          accountCode: e.accountId, // Using accountId as placeholder code
          debit: e.debit,
          credit: e.credit
        }))
      };
      try {
        const resp = await apiClient.post<{ journal: { id: string; ref: string; date: string; memo?: string } }>(`/api/accounting/journal`, payload, transactionData.orgId);
        // Return a minimal Transaction object (frontend consumers can reconcile later)
        return {
          ...transactionData,
            id: resp.journal.id,
            reference: resp.journal.ref,
            createdAt: new Date(),
            updatedAt: new Date()
        } as Transaction;
      } catch (e) {
        console.error('API transaction create failed, falling back to local logic?', e);
        // Continue to local logic fallback
      }
    }
    // Validate double-entry (debits = credits)
    const totalDebits = transactionData.entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredits = transactionData.entries.reduce((sum, entry) => sum + entry.credit, 0);
    
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new Error('Transaction is not balanced: debits must equal credits');
    }

  const batch = writeBatch(db);
    
    // Create transaction
    const transactionRef = doc(collection(db, 'transactions'));
    const transaction: Transaction = {
      ...transactionData,
      id: transactionRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    batch.set(transactionRef, transaction);
    
    // Update account balances
    for (const entry of transactionData.entries) {
      const accountRef = doc(db, 'accounts', entry.accountId);
      const accountDoc = await getDoc(accountRef);
      
      if (!accountDoc.exists()) {
        throw new Error(`Account ${entry.accountId} not found`);
      }
      
      const account = accountDoc.data() as Account;
      const balanceChange = this.calculateBalanceChange(account.type, entry.debit, entry.credit);
      
      batch.update(accountRef, {
        balance: account.balance + balanceChange,
        updatedAt: new Date()
      });
    }
    
  await batch.commit();
  return transaction;
  }

  private static calculateBalanceChange(accountType: string, debit: number, credit: number): number {
    // Asset and Expense accounts increase with debits
    if (accountType === 'asset' || accountType === 'expense') {
      return debit - credit;
    }
    // Liability, Equity, and Revenue accounts increase with credits
    else {
      return credit - debit;
    }
  }

  static async getTransactionsByOrganization(
    orgId: string,
    pageSize: number = 50,
    lastDoc?: DocumentSnapshot
  ): Promise<{ transactions: Transaction[], lastDoc?: DocumentSnapshot }> {
    let q = query(
      collection(db, 'transactions'),
      where('orgId', '==', orgId),
      orderBy('date', 'desc'),
      limit(pageSize)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Transaction));
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    return { transactions, lastDoc: newLastDoc };
  }

  // Invoice Management
  static async createInvoice(invoiceData: Omit<Invoice, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    // Generate invoice number
    const number = await this.generateInvoiceNumber(invoiceData.orgId);
    
    const docRef = await addDoc(collection(db, 'invoices'), {
      ...invoiceData,
      number,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const invoice: Invoice = {
      ...invoiceData,
      id: docRef.id,
      number,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create accounting entry for invoice
    if (invoiceData.status === 'sent' || invoiceData.status === 'paid') {
      await this.createInvoiceAccountingEntry(invoice);
    }
    
    return invoice;
  }

  private static async generateInvoiceNumber(orgId: string): Promise<string> {
    const year = new Date().getFullYear();
    const q = query(
      collection(db, 'invoices'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    let nextNumber = 1;
    
    if (!snapshot.empty) {
      const lastInvoice = snapshot.docs[0].data() as Invoice;
      const lastNumber = parseInt(lastInvoice.number.split('-').pop() || '0');
      nextNumber = lastNumber + 1;
    }
    
    return `INV-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }

  private static async createInvoiceAccountingEntry(invoice: Invoice): Promise<void> {
    // Get default accounts (these should be configurable per organization)
    const accountsQuery = query(
      collection(db, 'accounts'),
      where('orgId', '==', invoice.orgId)
    );
    const accountsSnapshot = await getDocs(accountsQuery);
    const accounts = accountsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Account));
    
    const arAccount = accounts.find(a => a.name.includes('Accounts Receivable'));
    const revenueAccount = accounts.find(a => a.name.includes('Service Revenue'));
    const taxAccount = accounts.find(a => a.name.includes('Tax'));
    
    if (!arAccount || !revenueAccount) {
      throw new Error('Required accounts not found for invoice entry');
    }

    const entries: TransactionEntry[] = [
      {
        accountId: arAccount.id,
        debit: invoice.total,
        credit: 0,
        description: `Invoice ${invoice.number}`
      },
      {
        accountId: revenueAccount.id,
        debit: 0,
        credit: invoice.subtotal,
        description: `Invoice ${invoice.number} - Revenue`
      }
    ];

    if (invoice.tax > 0 && taxAccount) {
      entries.push({
        accountId: taxAccount.id,
        debit: 0,
        credit: invoice.tax,
        description: `Invoice ${invoice.number} - Tax`
      });
    }

    await this.createTransaction({
      orgId: invoice.orgId,
      date: invoice.issueDate,
      description: `Invoice ${invoice.number}`,
      reference: invoice.id,
      entries,
      status: 'posted',
      createdBy: invoice.createdBy
    });
  }

  static async updateInvoiceStatus(invoiceId: string, status: Invoice['status']): Promise<void> {
    await updateDoc(doc(db, 'invoices', invoiceId), {
      status,
      updatedAt: new Date()
    });

    // If marked as paid, create payment entry
    if (status === 'paid') {
      const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
      if (invoiceDoc.exists()) {
        const invoice = invoiceDoc.data() as Invoice;
        await this.createPaymentEntry(invoice);
      }
    }
  }

  private static async createPaymentEntry(invoice: Invoice): Promise<void> {
    const accountsQuery = query(
      collection(db, 'accounts'),
      where('orgId', '==', invoice.orgId)
    );
    const accountsSnapshot = await getDocs(accountsQuery);
    const accounts = accountsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Account));
    
    const arAccount = accounts.find(a => a.name.includes('Accounts Receivable'));
    const cashAccount = accounts.find(a => a.name.includes('Cash'));
    
    if (!arAccount || !cashAccount) {
      throw new Error('Required accounts not found for payment entry');
    }

    const entries: TransactionEntry[] = [
      {
        accountId: cashAccount.id,
        debit: invoice.total,
        credit: 0,
        description: `Payment for Invoice ${invoice.number}`
      },
      {
        accountId: arAccount.id,
        debit: 0,
        credit: invoice.total,
        description: `Payment for Invoice ${invoice.number}`
      }
    ];

    await this.createTransaction({
      orgId: invoice.orgId,
      date: new Date(),
      description: `Payment for Invoice ${invoice.number}`,
      reference: invoice.id,
      entries,
      status: 'posted',
      createdBy: 'system'
    });
  }

  // Financial Reports
  static async generateTrialBalance(orgId: string, asOfDate: Date): Promise<{
    accounts: Array<{
      account: Account;
      debit: number;
      credit: number;
      balance: number;
    }>;
    totalDebits: number;
    totalCredits: number;
  }> {
    const accounts = await this.getAccountsByOrganization(orgId);
    
    const trialBalanceData = accounts.map(account => {
      const balance = account.balance;
      const isDebitBalance = account.type === 'asset' || account.type === 'expense';
      
      return {
        account,
        debit: isDebitBalance && balance > 0 ? balance : 0,
        credit: !isDebitBalance && balance > 0 ? balance : isDebitBalance && balance < 0 ? Math.abs(balance) : 0,
        balance
      };
    });

    const totalDebits = trialBalanceData.reduce((sum, item) => sum + item.debit, 0);
    const totalCredits = trialBalanceData.reduce((sum, item) => sum + item.credit, 0);

    return {
      accounts: trialBalanceData,
      totalDebits,
      totalCredits
    };
  }

  static async generateProfitAndLoss(orgId: string, startDate: Date, endDate: Date): Promise<{
    revenue: Array<{ account: Account; amount: number }>;
    expenses: Array<{ account: Account; amount: number }>;
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
  }> {
    const accounts = await this.getAccountsByOrganization(orgId);
    
    // Get transactions for the period
    const q = query(
      collection(db, 'transactions'),
      where('orgId', '==', orgId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      where('status', '==', 'posted')
    );
    
    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => doc.data() as Transaction);
    
    // Calculate account totals for the period
    const accountTotals = new Map<string, number>();
    
    transactions.forEach(transaction => {
      transaction.entries.forEach(entry => {
        const currentTotal = accountTotals.get(entry.accountId) || 0;
        const account = accounts.find(a => a.id === entry.accountId);
        
        if (account) {
          if (account.type === 'revenue') {
            accountTotals.set(entry.accountId, currentTotal + entry.credit - entry.debit);
          } else if (account.type === 'expense') {
            accountTotals.set(entry.accountId, currentTotal + entry.debit - entry.credit);
          }
        }
      });
    });
    
    const revenue = accounts
      .filter(account => account.type === 'revenue')
      .map(account => ({
        account,
        amount: accountTotals.get(account.id) || 0
      }))
      .filter(item => item.amount !== 0);
    
    const expenses = accounts
      .filter(account => account.type === 'expense')
      .map(account => ({
        account,
        amount: accountTotals.get(account.id) || 0
      }))
      .filter(item => item.amount !== 0);
    
    const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    
    return {
      revenue,
      expenses,
      totalRevenue,
      totalExpenses,
      netIncome
    };
  }

  static async generateBalanceSheet(orgId: string, asOfDate: Date): Promise<{
    assets: Array<{ account: Account; amount: number }>;
    liabilities: Array<{ account: Account; amount: number }>;
    equity: Array<{ account: Account; amount: number }>;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
  }> {
    const accounts = await this.getAccountsByOrganization(orgId);
    
    const assets = accounts
      .filter(account => account.type === 'asset')
      .map(account => ({ account, amount: account.balance }))
      .filter(item => item.amount !== 0);
    
    const liabilities = accounts
      .filter(account => account.type === 'liability')
      .map(account => ({ account, amount: account.balance }))
      .filter(item => item.amount !== 0);
    
    const equity = accounts
      .filter(account => account.type === 'equity')
      .map(account => ({ account, amount: account.balance }))
      .filter(item => item.amount !== 0);
    
    const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      assets,
      liabilities,
      equity,
      totalAssets,
      totalLiabilities,
      totalEquity
    };
  }
}