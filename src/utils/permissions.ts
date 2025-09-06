// Central policy map: action -> roles permitted
// Extend as needed; used by UI to check fine-grained permissions beyond module gating.
export const POLICY: Record<string, string[]> = {
  'expenses:approve': ['SUPER_ADMIN','ADMIN','ACCOUNTANT'],
  'expenses:edit': ['SUPER_ADMIN','ADMIN','ACCOUNTANT'],
  'expenses:delete': ['SUPER_ADMIN','ADMIN','ACCOUNTANT'],
  'tasks:create': ['SUPER_ADMIN','ADMIN','HR_MANAGER','EMPLOYEE'],
  'tasks:edit': ['SUPER_ADMIN','ADMIN','HR_MANAGER','EMPLOYEE'],
  'tasks:delete': ['SUPER_ADMIN','ADMIN','HR_MANAGER'],
  'reports:view': ['SUPER_ADMIN','ADMIN','ACCOUNTANT','HR_MANAGER'],
  'settings:modules:toggle': ['SUPER_ADMIN','ADMIN'],
  'audit:export': ['SUPER_ADMIN','ADMIN'],
};

export const can = (role: string | undefined, action: string): boolean => {
  if (!role) return false;
  const allowed = POLICY[action];
  return !!allowed && allowed.includes(role);
};
