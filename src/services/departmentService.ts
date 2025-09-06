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
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Department } from '../types/database';

export class DepartmentService {
  static async createDepartment(departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const docRef = await addDoc(collection(db, 'departments'), {
      ...departmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...departmentData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async getDepartmentsByOrganization(orgId: string): Promise<Department[]> {
    const q = query(
      collection(db, 'departments'),
      where('orgId', '==', orgId),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Department));
  }

  static async updateDepartment(departmentId: string, updates: Partial<Department>): Promise<void> {
    await updateDoc(doc(db, 'departments', departmentId), {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async deleteDepartment(departmentId: string): Promise<void> {
    await deleteDoc(doc(db, 'departments', departmentId));
  }

  static async getDepartmentById(departmentId: string): Promise<Department | null> {
    const docRef = doc(db, 'departments', departmentId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return { ...snapshot.data(), id: snapshot.id } as Department;
  }

  static async getActiveDepartments(orgId: string): Promise<Department[]> {
    const q = query(
      collection(db, 'departments'),
      where('orgId', '==', orgId),
      where('isActive', '==', true),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Department));
  }

  static async updateEmployeeCount(departmentId: string, count: number): Promise<void> {
    await updateDoc(doc(db, 'departments', departmentId), {
      employeeCount: count,
      updatedAt: new Date()
    });
  }

  static async getDepartmentHierarchy(orgId: string): Promise<Department[]> {
    const departments = await this.getDepartmentsByOrganization(orgId);
    
    // Build hierarchy tree
    const departmentMap = new Map<string, Department & { children: Department[] }>();
    const rootDepartments: (Department & { children: Department[] })[] = [];

    // Initialize all departments with children array
    departments.forEach(dept => {
      departmentMap.set(dept.id, { ...dept, children: [] });
    });

    // Build the tree structure
    departments.forEach(dept => {
      const deptWithChildren = departmentMap.get(dept.id)!;
      
      if (dept.parentDepartmentId) {
        const parent = departmentMap.get(dept.parentDepartmentId);
        if (parent) {
          parent.children.push(deptWithChildren);
        } else {
          rootDepartments.push(deptWithChildren);
        }
      } else {
        rootDepartments.push(deptWithChildren);
      }
    });

    return rootDepartments;
  }

  static async getDepartmentStats(orgId: string): Promise<{
    totalDepartments: number;
    activeDepartments: number;
    totalBudget: number;
    totalEmployees: number;
    avgEmployeesPerDept: number;
  }> {
    const departments = await this.getDepartmentsByOrganization(orgId);
    const activeDepts = departments.filter(d => d.isActive);

    return {
      totalDepartments: departments.length,
      activeDepartments: activeDepts.length,
      totalBudget: departments.reduce((sum, d) => sum + d.budget, 0),
      totalEmployees: departments.reduce((sum, d) => sum + d.employeeCount, 0),
      avgEmployeesPerDept: departments.length > 0 
        ? Math.round(departments.reduce((sum, d) => sum + d.employeeCount, 0) / departments.length)
        : 0
    };
  }
}