import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: string | number;
  isActive: boolean;
}

export function useAccounts(orgId: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['accounts', orgId, apiClient.isEnabled() ? 'api' : 'local'],
    enabled: !!orgId,
    queryFn: async (): Promise<Account[]> => {
      if (apiClient.isEnabled()) {
        return apiClient.get<Account[]>(`/api/accounts`, orgId);
      }
      return []; // TODO: local fallback
    }
  });

  const create = useMutation({
    mutationFn: async (data: { code: string; name: string; type: string }) => {
      if (!apiClient.isEnabled()) throw new Error('API disabled');
      return apiClient.post<Account>(`/api/accounts`, data, orgId);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts', orgId] }); }
  });

  const deactivate = useMutation({
    mutationFn: async (id: string) => {
      if (!apiClient.isEnabled()) throw new Error('API disabled');
      return apiClient.post<Account>(`/api/accounts/${id}/deactivate`, {}, orgId);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts', orgId] }); }
  });

  return { ...query, create, deactivate };
}

export default useAccounts;
