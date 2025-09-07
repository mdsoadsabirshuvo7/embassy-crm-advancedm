// Lightweight fetch wrapper that activates only when VITE_API_BASE is defined.
// Falls back to undefined (caller should branch) to preserve existing local/Firebase logic.

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

export interface ApiErrorShape {
  error: string;
  [k: string]: any;
}

async function request<T>(path: string, options: RequestInit & { orgId?: string } = {}): Promise<T> {
  if (!API_BASE) throw new Error('API base not configured');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (options.orgId) headers['x-org-id'] = options.orgId;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data: any = undefined;
  try { data = text ? JSON.parse(text) : undefined; } catch { /* non-JSON */ }
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

export const apiClient = {
  isEnabled(): boolean { return !!API_BASE; },
  get: <T>(path: string, orgId?: string) => request<T>(path, { method: 'GET', orgId }),
  post: <T>(path: string, body: any, orgId?: string) => request<T>(path, { method: 'POST', body: JSON.stringify(body), orgId })
};

export default apiClient;
