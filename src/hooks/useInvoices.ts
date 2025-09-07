import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

interface Invoice {
  id: string;
  number: string;
  subtotal: string | number;
  tax: string | number;
  total: string | number;
  status: string;
  issueDate: string;
  dueDate?: string;
}

export function useInvoices(orgId: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['invoices', orgId, apiClient.isEnabled() ? 'api' : 'local'],
    enabled: !!orgId,
    queryFn: async (): Promise<Invoice[]> => {
      if (apiClient.isEnabled()) {
        return apiClient.get<Invoice[]>(`/api/invoices`, orgId);
      }
      return []; // TODO: local fallback
    }
  });

  const create = useMutation({
    mutationFn: async (data: { number: string; subtotal: number; tax: number; total: number; status: string; issueDate: string; dueDate?: string }) => {
      if (!apiClient.isEnabled()) throw new Error('API disabled');
      return apiClient.post<Invoice>(`/api/invoices`, data, orgId);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices', orgId] }); }
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: { id: string; status: string }) => {
      if (!apiClient.isEnabled()) throw new Error('API disabled');
      return apiClient.post<Invoice>(`/api/invoices/${vars.id}/status`, { status: vars.status }, orgId);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices', orgId] }); }
  });

  return { ...query, create, updateStatus };
}

export default useInvoices;
