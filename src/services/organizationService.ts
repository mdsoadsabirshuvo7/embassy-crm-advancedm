import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Organization } from '../types/database';

export class OrganizationService {
  static async createOrganization(orgData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const docRef = await addDoc(collection(db, 'organizations'), {
      ...orgData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const newOrg: Organization = {
      ...orgData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newOrg;
  }

  static async getOrganization(orgId: string): Promise<Organization | null> {
    const docSnap = await getDoc(doc(db, 'organizations', orgId));
    if (!docSnap.exists()) return null;
    
    return { ...docSnap.data(), id: docSnap.id } as Organization;
  }

  static async updateOrganization(orgId: string, updates: Partial<Organization>): Promise<void> {
    await updateDoc(doc(db, 'organizations', orgId), {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async getOrganizationBySubdomain(subdomain: string): Promise<Organization | null> {
    const q = query(collection(db, 'organizations'), where('subdomain', '==', subdomain));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { ...doc.data(), id: doc.id } as Organization;
  }

  static async updateBranding(orgId: string, branding: {
    logo?: string;
    letterhead?: string;
    stamp?: string;
    primaryColor: string;
    secondaryColor: string;
  }): Promise<void> {
    await this.updateOrganization(orgId, branding);
  }

  static async updateSettings(orgId: string, settings: {
    currency?: 'BDT' | 'USD';
    language?: 'en' | 'bn';
    timezone?: string;
  }): Promise<void> {
    await this.updateOrganization(orgId, settings);
  }

  // List all organizations (restricted to SUPER_ADMIN usage at call site)
  static async listOrganizations(): Promise<Organization[]> {
    const snapshot = await getDocs(collection(db, 'organizations'));
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as Omit<Organization, 'id'>) }));
  }
}