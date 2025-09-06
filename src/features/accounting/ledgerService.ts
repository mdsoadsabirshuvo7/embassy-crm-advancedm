import { v4 as uuid } from 'uuid';
import { Account, JournalEntry, JournalLine, LedgerBalanceSnapshot, TaxRule, BudgetLine } from './ledgerTypes';

// Simple in-memory cache layer (will be replaced / backed by Firestore or IndexedDB)
interface AccountingState {
  accounts: Account[];
  journal: JournalEntry[];
  taxRules: TaxRule[];
  budgets: BudgetLine[];
  balances: LedgerBalanceSnapshot[]; // cached snapshots
}

const stateByOrg: Record<string, AccountingState> = {};

function ensureOrg(orgId: string): AccountingState {
  if (!stateByOrg[orgId]) {
    stateByOrg[orgId] = { accounts: [], journal: [], taxRules: [], budgets: [], balances: [] };
  }
  return stateByOrg[orgId];
}

export const AccountingService = {
  addAccount(orgId: string, partial: Omit<Partial<Account>, 'id' | 'createdAt' | 'updatedAt'> & { name: string; code: string; type: Account['type']; }): Account {
    const state = ensureOrg(orgId);
    const now = new Date().toISOString();
    const account: Account = { id: uuid(), createdAt: now, updatedAt: now, orgId, currency: partial.currency, parentId: partial.parentId, name: partial.name, code: partial.code, type: partial.type };
    state.accounts.push(account);
    return account;
  },
  listAccounts(orgId: string): Account[] {
    return ensureOrg(orgId).accounts;
  },
  postJournalEntry(orgId: string, payload: { date: string; lines: Omit<JournalLine, 'id'>[]; reference?: string; createdBy?: string; }): JournalEntry {
    // Basic validation: debits == credits
    const totalDebit = payload.lines.reduce((s, l) => s + (l.debit || 0), 0);
    const totalCredit = payload.lines.reduce((s, l) => s + (l.credit || 0), 0);
    if (Number(totalDebit.toFixed(2)) !== Number(totalCredit.toFixed(2))) {
      throw new Error('Unbalanced journal entry');
    }
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: uuid(),
      date: payload.date,
      lines: payload.lines.map(l => ({ ...l, id: uuid() })),
      reference: payload.reference,
      createdBy: payload.createdBy,
      orgId,
      createdAt: now,
      updatedAt: now,
    };
    const state = ensureOrg(orgId);
    state.journal.push(entry);
    return entry;
  },
  listJournal(orgId: string): JournalEntry[] { return ensureOrg(orgId).journal; },
  addTaxRule(orgId: string, rule: Omit<TaxRule, 'id'>): TaxRule {
    const now = new Date().toISOString();
    const r: TaxRule = { ...rule, id: uuid(), orgId: rule.orgId || orgId };
    ensureOrg(orgId).taxRules.push(r);
    return r;
  },
  listTaxRules(orgId: string): TaxRule[] { return ensureOrg(orgId).taxRules.filter(r => !r.orgId || r.orgId === orgId); },
  addBudgetLine(orgId: string, line: Omit<BudgetLine, 'id'>): BudgetLine {
    const l: BudgetLine = { ...line, id: uuid(), orgId: line.orgId || orgId };
    ensureOrg(orgId).budgets.push(l);
    return l;
  },
  listBudget(orgId: string): BudgetLine[] { return ensureOrg(orgId).budgets; },
  trialBalance(orgId: string, upToDate?: string) {
    const state = ensureOrg(orgId);
    const accounts = state.accounts;
    const lines = state.journal.filter(j => !upToDate || j.date <= upToDate).flatMap(j => j.lines);
    const map: Record<string, { debit: number; credit: number; account: Account }> = {};
    for (const a of accounts) map[a.id] = { debit: 0, credit: 0, account: a };
    for (const l of lines) {
      if (!map[l.accountId]) continue;
      map[l.accountId].debit += l.debit || 0;
      map[l.accountId].credit += l.credit || 0;
    }
    return Object.values(map).map(v => ({ account: v.account, debit: v.debit, credit: v.credit, balance: v.debit - v.credit }));
  },
};
