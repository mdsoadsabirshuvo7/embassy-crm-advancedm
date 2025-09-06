import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types/database';

export class ClientService {
  static async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const docRef = await addDoc(collection(db, 'clients'), {
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...clientData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async getClient(clientId: string): Promise<Client | null> {
    const docSnap = await getDoc(doc(db, 'clients', clientId));
    if (!docSnap.exists()) return null;
    
    return { ...docSnap.data(), id: docSnap.id } as Client;
  }

  static async updateClient(clientId: string, updates: Partial<Client>): Promise<void> {
    await updateDoc(doc(db, 'clients', clientId), {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async deleteClient(clientId: string): Promise<void> {
    await deleteDoc(doc(db, 'clients', clientId));
  }

  static async getClientsByOrganization(
    orgId: string, 
    pageSize: number = 50,
    lastDoc?: DocumentSnapshot
  ): Promise<{ clients: Client[], lastDoc?: DocumentSnapshot }> {
    let q = query(
      collection(db, 'clients'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const snapshot = await getDocs(q);
    const clients = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client));
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    return { clients, lastDoc: newLastDoc };
  }

  static async searchClients(orgId: string, searchTerm: string): Promise<Client[]> {
    // Note: For production, consider using Algolia or similar for full-text search
    const q = query(
      collection(db, 'clients'),
      where('orgId', '==', orgId),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    const allClients = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client));
    
    // Client-side filtering (consider server-side for large datasets)
    return allClients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.passportNumber && client.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  static async getClientsByEmployee(orgId: string, employeeId: string): Promise<Client[]> {
    const q = query(
      collection(db, 'clients'),
      where('orgId', '==', orgId),
      where('assignedTo', '==', employeeId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client));
  }

  static async getClientStats(orgId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    totalBilled: number;
    totalPaid: number;
  }> {
    const q = query(collection(db, 'clients'), where('orgId', '==', orgId));
    const snapshot = await getDocs(q);
    const clients = snapshot.docs.map(doc => doc.data() as Client);
    
    return {
      total: clients.length,
      active: clients.filter(c => c.status === 'active').length,
      inactive: clients.filter(c => c.status === 'inactive').length,
      pending: clients.filter(c => c.status === 'pending').length,
      totalBilled: clients.reduce((sum, c) => sum + c.totalBilled, 0),
      totalPaid: clients.reduce((sum, c) => sum + c.totalPaid, 0)
    };
  }

  static async assignClientToEmployee(clientId: string, employeeId: string): Promise<void> {
    await updateDoc(doc(db, 'clients', clientId), {
      assignedTo: employeeId,
      updatedAt: new Date()
    });
  }

  static async updateClientBilling(clientId: string, amountBilled: number, amountPaid: number): Promise<void> {
    const client = await this.getClient(clientId);
    if (!client) throw new Error('Client not found');
    
    await updateDoc(doc(db, 'clients', clientId), {
      totalBilled: client.totalBilled + amountBilled,
      totalPaid: client.totalPaid + amountPaid,
      updatedAt: new Date()
    });
  }
}