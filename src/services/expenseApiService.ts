// Optional API-backed expense fetcher. Falls back to caller using local service if disabled.
import apiClient from './apiClient';

export interface ApiExpense {
  id: string;
  orgId: string;
  amount: string | number; // string if coming from decimal, number locally
  currency: string;
  memo?: string;
  createdAt: string;
}

export const ExpenseApiService = {
  async list(orgId: string): Promise<ApiExpense[]> {
    if (!apiClient.isEnabled()) throw new Error('API not enabled');
    return apiClient.get<ApiExpense[]>(`/api/expenses`, orgId);
  }
};

export default ExpenseApiService;
