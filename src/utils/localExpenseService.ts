// Minimal local fallback expense service.
// Reads a namespaced localStorage collection `expenses` expecting array of objects { id, orgId, amount, currency, memo, createdAt }

interface LocalExpense {
  id: string;
  orgId: string;
  amount: number;
  currency: string;
  memo?: string;
  createdAt: string;
}

function readAll(): LocalExpense[] {
  try {
    const raw = localStorage.getItem('expenses');
    if (!raw) return [];
    return JSON.parse(raw) as LocalExpense[];
  } catch { return []; }
}

export const LocalExpenseService = {
  list(orgId: string): LocalExpense[] {
    return readAll().filter(e => e.orgId === orgId).sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export default LocalExpenseService;
