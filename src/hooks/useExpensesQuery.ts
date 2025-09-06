import { useQuery, useMutation } from '@tanstack/react-query';
import { LocalStorageService } from '@/services/localStorageService';
import { Expense } from '@/types/expense';
import { queryClient } from '@/lib/queryClient';
import { useTenant } from '@/contexts/TenantContext';

// Keys
const expenseKeys = {
  all: (orgId: string | null) => ['expenses', orgId] as const,
  list: (orgId: string | null) => ['expenses', orgId, 'list'] as const,
  id: (orgId: string | null, id: string) => ['expenses', orgId, 'detail', id] as const,
};

export function useExpensesQuery() {
  const { currentOrgId } = useTenant();
  const expensesQuery = useQuery({
    queryKey: expenseKeys.list(currentOrgId),
    queryFn: async () => {
      const all = LocalStorageService.getExpenses();
      return all.filter(e => !currentOrgId || e.orgId === currentOrgId);
    },
    enabled: !!currentOrgId,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      const withOrg = { ...data, orgId: currentOrgId || data.orgId } as typeof data;
      return LocalStorageService.addExpense(withOrg);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all(currentOrgId) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Expense> }) => {
      LocalStorageService.updateExpense(id, updates);
      return { id, updates };
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: expenseKeys.list(currentOrgId) });
      const prev = queryClient.getQueryData<Expense[]>(expenseKeys.list(currentOrgId));
      if (prev) {
        queryClient.setQueryData<Expense[]>(expenseKeys.list(currentOrgId), prev.map(e => e.id === id ? { ...e, ...updates } : e));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(expenseKeys.list(currentOrgId), ctx.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all(currentOrgId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      LocalStorageService.deleteExpense(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: expenseKeys.list(currentOrgId) });
      const prev = queryClient.getQueryData<Expense[]>(expenseKeys.list(currentOrgId));
      if (prev) {
        queryClient.setQueryData<Expense[]>(expenseKeys.list(currentOrgId), prev.filter(e => e.id !== id));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(expenseKeys.list(currentOrgId), ctx.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all(currentOrgId) });
    },
  });

  return {
  expensesQuery,
    addExpense: addMutation.mutateAsync,
    updateExpense: (id: string, updates: Partial<Expense>) => updateMutation.mutateAsync({ id, updates }),
    deleteExpense: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
