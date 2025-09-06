import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../services/authService';
import { OrganizationService } from '../services/organizationService';
import { User, UserRole, Organization } from '../types/database';
import { demoOrganization } from '../data/demoAccounts';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      setIsLoading(true);
      
      try {
        // Check for demo user first
        const demoUserData = localStorage.getItem('demoUser');
        if (demoUserData) {
          const userData = JSON.parse(demoUserData) as User;
          setUser(userData);
          setOrganization(demoOrganization);
          setIsLoading(false);
          return;
        }

        // Then check Firebase auth state
        const userData = await AuthService.getCurrentUser();
        if (userData) {
          setUser(userData);
          
          // Load organization data
          const orgData = await OrganizationService.getOrganization(userData.orgId);
          setOrganization(orgData);
        } else {
          setUser(null);
          setOrganization(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
        setOrganization(null);
      }
      
      setIsLoading(false);
    };

    loadCurrentUser();

    // Set up Firebase auth state listener
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      // Only handle Firebase auth changes if no demo user is active
      const demoUserData = localStorage.getItem('demoUser');
      if (!demoUserData) {
        if (firebaseUser) {
          try {
            const userData = await AuthService.getCurrentUser();
            if (userData) {
              setUser(userData);
              const orgData = await OrganizationService.getOrganization(userData.orgId);
              setOrganization(orgData);
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            setUser(null);
            setOrganization(null);
          }
        } else {
          setUser(null);
          setOrganization(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await AuthService.signIn(email, password);
      setUser(userData);
      
      // For demo accounts, use demo organization
      if (userData.orgId === 'demo-org-1') {
        setOrganization(demoOrganization);
      } else {
        // Load real organization data for non-demo accounts
        const orgData = await OrganizationService.getOrganization(userData.orgId);
        setOrganization(orgData);
      }
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const logout = async (): Promise<void> => {
    await AuthService.signOut();
    setUser(null);
    setOrganization(null);
  };

  const refreshUser = async (): Promise<void> => {
    if (user) {
      const userData = await AuthService.getCurrentUser();
      if (userData) {
        setUser(userData);
        
        // For demo accounts, use demo organization
        if (userData.orgId === 'demo-org-1') {
          setOrganization(demoOrganization);
        } else {
          const orgData = await OrganizationService.getOrganization(userData.orgId);
          setOrganization(orgData);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      organization, 
      isLoading, 
      login, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};