import { useQuery } from '@tanstack/react-query';
import ExpenseApiService from '@/services/expenseApiService';
import { LocalExpenseService } from '@/utils/localExpenseService'; // hypothetical fallback (create if absent)
import apiClient from '@/services/apiClient';

// If a local expense service doesn't exist yet, you can implement minimal stub.
// This hook chooses the API or local strategy transparently.

export function useExpenses(orgId: string) {
  return useQuery({
    queryKey: ['expenses', orgId, apiClient.isEnabled() ? 'api' : 'local'],
    queryFn: async () => {
      if (apiClient.isEnabled()) {
        return ExpenseApiService.list(orgId);
      }
      // Fallback: implement local retrieval, e.g. from localStorage or existing context
      if (LocalExpenseService && typeof LocalExpenseService.list === 'function') {
        return LocalExpenseService.list(orgId);
      }
      return [];
    },
    enabled: !!orgId
  });
}

export default useExpenses;
