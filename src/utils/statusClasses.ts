// Central mapping for status -> Tailwind class strings to keep consistency.
export const statusClasses: Record<string, string> = {
  approved: 'bg-success text-success-foreground',
  reimbursed: 'bg-primary text-primary-foreground',
  submitted: 'bg-warning text-warning-foreground',
  draft: 'bg-muted text-muted-foreground',
  rejected: 'bg-destructive text-destructive-foreground'
};

export const getStatusClass = (status: string): string => {
  return statusClasses[status] || 'bg-secondary text-secondary-foreground';
};