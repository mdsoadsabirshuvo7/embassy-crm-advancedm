import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useTenant } from '@/contexts/TenantContext';

// UI Task shape kept local (not the domain Task type in database.ts)
export interface UITask {
  id: string;
  orgId: string; // tenant scope
  title: string;
  description: string;
  assignedTo: { id: string; name: string; avatar?: string };
  assignedBy: { id: string; name: string };
  client?: { id: string; name: string };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string; // ISO date string
  createdAt: string;
  labels: string[];
}

const STORAGE_KEY_BASE = 'embassyflow_tasks_v1';
const keyForOrg = (orgId: string | null) => `${STORAGE_KEY_BASE}_${orgId || 'global'}`;

const loadTasks = (orgId: string | null): UITask[] => {
  try { return JSON.parse(localStorage.getItem(keyForOrg(orgId)) || '[]'); } catch { return []; }
};
const saveTasks = (orgId: string | null, tasks: UITask[]) => { try { localStorage.setItem(keyForOrg(orgId), JSON.stringify(tasks)); } catch { /* ignore */ } };

const taskKeys = {
  all: (orgId: string | null) => ['tasks', orgId] as const,
  list: (orgId: string | null) => ['tasks', orgId, 'list'] as const,
  id: (orgId: string | null, id: string) => ['tasks', orgId, 'detail', id] as const,
};

export function useTasksQuery() {
  const { currentOrgId } = useTenant();
  const tasksQuery = useQuery({
    queryKey: taskKeys.list(currentOrgId),
    queryFn: async () => Promise.resolve(loadTasks(currentOrgId)),
    staleTime: 1000 * 30,
    enabled: !!currentOrgId,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Omit<UITask, 'id' | 'createdAt' | 'orgId'> & { id?: string }) => {
      const tasks = loadTasks(currentOrgId);
      const newTask: UITask = {
        ...data,
        orgId: currentOrgId || 'global',
        id: data.id || Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      saveTasks(currentOrgId, [newTask, ...tasks]);
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(currentOrgId) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UITask> }) => {
      const tasks = loadTasks(currentOrgId);
      const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
      saveTasks(currentOrgId, updated);
      return { id, updates };
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.list(currentOrgId) });
      const prev = queryClient.getQueryData<UITask[]>(taskKeys.list(currentOrgId));
      if (prev) {
        queryClient.setQueryData<UITask[]>(taskKeys.list(currentOrgId), prev.map(t => t.id === id ? { ...t, ...updates } : t));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) queryClient.setQueryData(taskKeys.list(currentOrgId), ctx.prev); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: taskKeys.list(currentOrgId) }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const tasks = loadTasks(currentOrgId);
      saveTasks(currentOrgId, tasks.filter(t => t.id !== id));
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.list(currentOrgId) });
      const prev = queryClient.getQueryData<UITask[]>(taskKeys.list(currentOrgId));
      if (prev) {
        queryClient.setQueryData<UITask[]>(taskKeys.list(currentOrgId), prev.filter(t => t.id !== id));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) queryClient.setQueryData(taskKeys.list(currentOrgId), ctx.prev); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: taskKeys.list(currentOrgId) }); },
  });

  return {
    tasksQuery,
    addTask: addMutation.mutateAsync,
    updateTask: (id: string, updates: Partial<UITask>) => updateMutation.mutateAsync({ id, updates }),
    deleteTask: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
