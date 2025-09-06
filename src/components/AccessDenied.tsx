import React from 'react';
import { ShieldAlert, Lock, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useModules } from '@/contexts/ModuleContext';
import { useAuth } from '@/contexts/AuthContext';

interface AccessDeniedProps {
  reason: 'role' | 'module';
  moduleId?: string;
  requiredRoles?: string[];
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ reason, moduleId, requiredRoles }) => {
  const navigate = useNavigate();
  const { toggleModule } = useModules();
  const { user } = useAuth();
  const canToggle = user && ['SUPER_ADMIN','ADMIN'].includes(user.role) && moduleId;
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        {reason === 'role' ? (
          <ShieldAlert className="w-10 h-10 text-destructive" />
        ) : (
          <Lock className="w-10 h-10 text-destructive" />
        )}
      </div>
      <h1 className="text-3xl font-bold mb-2 text-foreground">Access Restricted</h1>
      {reason === 'role' && (
        <p className="text-muted-foreground mb-4">
          You don't have permission to view this page. Required role(s): {requiredRoles?.join(', ')}.
        </p>
      )}
      {reason === 'module' && (
        <p className="text-muted-foreground mb-4">
          The module <span className="font-semibold">{moduleId}</span> is currently disabled. Enable it in Settings → Modules to proceed.
        </p>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        {reason === 'module' && moduleId && (
          <>
            <Button variant="outline" onClick={() => navigate('/settings/modules')}>
              <ToggleLeft className="w-4 h-4 mr-2" /> Open Module Settings
            </Button>
            {canToggle && (
              <Button variant="secondary" onClick={() => { toggleModule(moduleId as import('../contexts/ModuleContext').ModuleName); navigate(moduleId === 'dashboard' ? '/dashboard' : `/${moduleId}`); }}>
                Quick Enable
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AccessDenied;