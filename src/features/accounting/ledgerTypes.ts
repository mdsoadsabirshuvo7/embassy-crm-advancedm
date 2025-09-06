// Advanced Accounting Domain Types (scaffold)
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT' | string;

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
  parentId?: string;
  currency?: CurrencyCode;
  orgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  debit: number; // positive amount
  credit: number; // positive amount
  currency?: CurrencyCode;
  memo?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  lines: JournalLine[];
  reference?: string;
  orgId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerBalanceSnapshot {
  accountId: string;
  period: string; // YYYY-MM
  opening: number;
  debit: number;
  credit: number;
  closing: number;
  currency?: CurrencyCode;
}

export interface TaxRule {
  id: string;
  country: string;
  jurisdiction?: string;
  name: string;
  rate: number; // 0..1
  type: 'VAT' | 'GST' | 'CORPORATE' | 'WITHHOLDING';
  effectiveFrom: string;
  effectiveTo?: string;
  orgId?: string; // optional per-org override
}

export interface BudgetLine {
  id: string;
  period: string; // YYYY-MM
  accountId: string;
  amount: number;
  currency?: CurrencyCode;
  orgId?: string;
}
