/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Organization } from '@/types/database';
import { useAuth } from './AuthContext';
import { OrganizationService } from '@/services/organizationService';

interface TenantContextType {
  currentOrgId: string | null;
  organization: Organization | null; // Active org (may mirror AuthContext org if no switch)
  organizations: Organization[]; // Accessible orgs for user
  loading: boolean;
  switchOrg: (orgId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, organization: authOrg } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load accessible orgs
  const refreshOrganizations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // SUPER_ADMIN can see all orgs, others just their own
      if (user.role === 'SUPER_ADMIN') {
        const list = await OrganizationService.listOrganizations();
        setOrganizations(list);
      } else if (authOrg) {
        setOrganizations([authOrg]);
      }
    } catch (err) {
      console.error('Failed loading organizations', err);
    } finally {
      setLoading(false);
    }
  }, [user, authOrg]);

  // Initialize on mount / auth change
  useEffect(() => {
    refreshOrganizations();
  }, [refreshOrganizations]);

  // Sync active org
  useEffect(() => {
    // Preference order: existing currentOrgId, persisted localStorage, authOrg
    const persisted = localStorage.getItem('activeOrgId');
    if (currentOrgId) return; // already set
    if (persisted) {
      setCurrentOrgId(persisted);
    } else if (authOrg) {
      setCurrentOrgId(authOrg.id);
      localStorage.setItem('activeOrgId', authOrg.id);
    }
  }, [authOrg, currentOrgId]);

  // Keep local organization state in sync
  useEffect(() => {
    if (!currentOrgId) {
      setOrganization(null);
      return;
    }
    // Try find in loaded list first
    const found = organizations.find(o => o.id === currentOrgId);
    if (found) {
      setOrganization(found);
    } else if (authOrg && authOrg.id === currentOrgId) {
      setOrganization(authOrg);
    } else {
      // Fallback fetch
      OrganizationService.getOrganization(currentOrgId).then(o => {
        if (o) setOrganization(o);
      }).catch(() => {/* ignore */});
    }
  }, [currentOrgId, organizations, authOrg]);

  const switchOrg = async (orgId: string) => {
    if (orgId === currentOrgId) return;
    setCurrentOrgId(orgId);
    localStorage.setItem('activeOrgId', orgId);
    // Update cached organization if present
    const found = organizations.find(o => o.id === orgId);
    if (found) setOrganization(found);
  };

  const value: TenantContextType = {
    currentOrgId,
    organization,
    organizations,
    loading,
    switchOrg,
    refreshOrganizations
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within a TenantProvider');
  return ctx;
};
