import React, { useState } from 'react';
import { OrganizationService } from '@/services/organizationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

export const OrgCreationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshOrganizations, switchOrg } = useTenant();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const org = await OrganizationService.createOrganization({
        name,
        subdomain,
        address: '',
        phone: '',
        email: '',
        primaryColor: '#2563eb',
        secondaryColor: '#1e293b',
        currency: 'USD',
        language: 'en',
        timezone: 'UTC',
        isActive: true,
        logo: undefined,
        letterhead: undefined,
        stamp: undefined,
        website: ''
      });
      await refreshOrganizations();
      await switchOrg(org.id);
      setName(''); setSubdomain('');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-2 border p-3 rounded-md bg-card">
      <h4 className="text-sm font-medium">Create Organization</h4>
      <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <Input placeholder="Subdomain" value={subdomain} onChange={e=>setSubdomain(e.target.value)} />
      <Button size="sm" onClick={handleCreate} disabled={!name || !subdomain || loading}>Create</Button>
    </div>
  );
};
