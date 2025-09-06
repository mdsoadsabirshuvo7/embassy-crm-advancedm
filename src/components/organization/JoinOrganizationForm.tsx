import React, { useState } from 'react';
import { InvitationService } from '@/services/invitationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { OrganizationService } from '@/services/organizationService';

export const JoinOrganizationForm: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { switchOrg, refreshOrganizations } = useTenant();
  const { user } = useAuth();

  const handleJoin = async () => {
    setError(null);
    try {
      const invite = await InvitationService.findByToken(token.trim());
      if (!invite) { setError('Invalid invitation token'); return; }
      if (!user) { setError('Not authenticated'); return; }
      await InvitationService.acceptInvitation(invite.id!);
      // Reload orgs & switch
      await refreshOrganizations();
      await switchOrg(invite.orgId);
      setToken('');
    } catch (e) {
      setError('Failed to join organization');
    }
  };

  return (
    <div className="space-y-2 border p-3 rounded-md bg-card">
      <h4 className="text-sm font-medium">Join Organization</h4>
      <Input placeholder="Invitation Token" value={token} onChange={e=>setToken(e.target.value)} />
      {error && <div className="text-xs text-destructive">{error}</div>}
      <Button size="sm" onClick={handleJoin} disabled={!token}>Join</Button>
    </div>
  );
};
