// Bank reconciliation placeholder service
// Supports importing bank statement lines and auto-matching to journal entries.
import { v4 as uuid } from 'uuid';
import { JournalEntry } from './ledgerTypes';

export interface BankStatementLine {
  id: string;
  date: string;
  description: string;
  amount: number; // positive for credit to bank account, negative for debit
  currency: string;
  externalRef?: string;
  matchedJournalEntryId?: string;
  confidence?: number;
}

interface ReconciliationState { statements: BankStatementLine[]; }
const state: Record<string, ReconciliationState> = {};
function ensure(orgId: string): ReconciliationState { return state[orgId] ||= { statements: [] }; }

export const ReconciliationService = {
  importCsv(orgId: string, csvText: string, currency: string): BankStatementLine[] {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim()).slice(1); // skip header naive
    const imported: BankStatementLine[] = lines.map(row => {
      const [date, description, amountStr, externalRef] = row.split(',');
      return { id: uuid(), date, description, amount: parseFloat(amountStr), currency, externalRef };
    });
    const s = ensure(orgId);
    s.statements.push(...imported);
    return imported;
  },
  autoMatch(orgId: string, journal: JournalEntry[]): void {
    const s = ensure(orgId);
    // Naive amount/date matching heuristic
    for (const stmt of s.statements) {
      if (stmt.matchedJournalEntryId) continue;
      const candidate = journal.find(j => j.date === stmt.date && j.lines.some(l => (l.debit - l.credit) === -stmt.amount));
      if (candidate) {
        stmt.matchedJournalEntryId = candidate.id;
        stmt.confidence = 0.55;
      }
    }
  },
  list(orgId: string): BankStatementLine[] { return ensure(orgId).statements; }
};
