import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  collection,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, UserRole, Organization } from '../types/database';
import { validateDemoCredentials, getDemoUser } from '../data/demoAccounts';

export class AuthService {
  static async signIn(email: string, password: string): Promise<User> {
    try {
      // Check if it's a demo account first
      if (validateDemoCredentials(email, password)) {
        const demoUser = getDemoUser(email);
        if (demoUser) {
          // Store demo user session in localStorage for persistence
          localStorage.setItem('demoUser', JSON.stringify(demoUser));
          return demoUser;
        }
      }

      // If not demo account, try Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data() as User;
      
      // Verify user is active
      if (!userData.isActive) {
        throw new Error('Account is deactivated');
      }
      
      return userData;
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('demo')) {
        throw error;
      }
      throw new Error('Invalid email or password');
    }
  }

  static async signOut(): Promise<void> {
    // Clear demo user session
    localStorage.removeItem('demoUser');
    
    // Sign out from Firebase if authenticated
    if (auth.currentUser) {
      await signOut(auth);
    }
  }

  static async createUser(
    email: string, 
    password: string, 
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const newUser: User = {
        ...userData,
        id: firebaseUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return newUser;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'User creation failed';
      throw new Error(message);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    // Check for demo user session first
    const demoUserData = localStorage.getItem('demoUser');
    if (demoUserData) {
      return JSON.parse(demoUserData) as User;
    }

    // Check Firebase user
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) return null;
    
    return userDoc.data() as User;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async getUsersByOrganization(orgId: string): Promise<User[]> {
    const q = query(collection(db, 'users'), where('orgId', '==', orgId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
  }

  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static hasPermission(user: User, permission: string): boolean {
    // Super admins have all permissions
    if (user.role === 'SUPER_ADMIN') return true;
    
    // Check specific permissions
    return user.permissions.includes(permission);
  }

  static canAccessModule(user: User, module: string): boolean {
    const modulePermissions: Record<string, UserRole[]> = {
      'dashboard': ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'HR_MANAGER', 'EMPLOYEE'],
      'clients': ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'],
      'accounting': ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'],
      'hr': ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'],
      'settings': ['SUPER_ADMIN', 'ADMIN'],
      'reports': ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'HR_MANAGER']
    };
    
    return modulePermissions[module]?.includes(user.role) || false;
  }
}