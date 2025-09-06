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
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Employee, Payroll, Attendance, LeaveRequest } from '../types/database';
import { AccountingService } from './accountingService';

export class HRService {
  // Employee Management
  static async createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const docRef = await addDoc(collection(db, 'employees'), {
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...employeeData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async getEmployeesByOrganization(orgId: string): Promise<Employee[]> {
    const q = query(
      collection(db, 'employees'),
      where('orgId', '==', orgId),
      where('status', '==', 'active'),
      orderBy('employeeId')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Employee));
  }

  static async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<void> {
    await updateDoc(doc(db, 'employees', employeeId), {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Attendance Management
  static async recordAttendance(attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendance> {
    const docRef = await addDoc(collection(db, 'attendance'), {
      ...attendanceData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...attendanceData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async getAttendanceByEmployee(
    employeeId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Attendance[]> {
    const q = query(
      collection(db, 'attendance'),
      where('employeeId', '==', employeeId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Attendance));
  }

  static async clockIn(employeeId: string, orgId: string): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already clocked in today
    const existingQuery = query(
      collection(db, 'attendance'),
      where('employeeId', '==', employeeId),
      where('orgId', '==', orgId),
      where('date', '>=', Timestamp.fromDate(today))
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      throw new Error('Already clocked in today');
    }
    
    return this.recordAttendance({
      orgId,
      employeeId,
      date: new Date(),
      clockIn: new Date(),
      breakDuration: 0,
      totalHours: 0,
      overtime: 0,
      status: 'present'
    });
  }

  static async clockOut(attendanceId: string): Promise<void> {
    const attendanceDoc = await getDoc(doc(db, 'attendance', attendanceId));
    
    if (!attendanceDoc.exists()) {
      throw new Error('Attendance record not found');
    }
    
    const attendance = attendanceDoc.data() as Attendance;
    const clockOut = new Date();
    const clockIn = attendance.clockIn instanceof Date ? attendance.clockIn : (attendance.clockIn as any).toDate();
    
    const totalMinutes = Math.floor((clockOut.getTime() - clockIn.getTime()) / (1000 * 60));
    const totalHours = Math.max(0, (totalMinutes - attendance.breakDuration) / 60);
    const overtime = Math.max(0, totalHours - 8); // Standard 8-hour workday
    
    await updateDoc(doc(db, 'attendance', attendanceId), {
      clockOut,
      totalHours,
      overtime,
      updatedAt: new Date()
    });
  }

  // Leave Management
  static async requestLeave(leaveData: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeaveRequest> {
    const docRef = await addDoc(collection(db, 'leaveRequests'), {
      ...leaveData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...leaveData,
      id: docRef.id,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async approveLeave(leaveId: string, approvedBy: string): Promise<void> {
    await updateDoc(doc(db, 'leaveRequests', leaveId), {
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
      updatedAt: new Date()
    });
  }

  static async rejectLeave(leaveId: string, approvedBy: string): Promise<void> {
    await updateDoc(doc(db, 'leaveRequests', leaveId), {
      status: 'rejected',
      approvedBy,
      approvedAt: new Date(),
      updatedAt: new Date()
    });
  }

  static async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    const q = query(
      collection(db, 'leaveRequests'),
      where('employeeId', '==', employeeId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LeaveRequest));
  }

  // Payroll Management
  static async generatePayroll(
    orgId: string, 
    employeeId: string, 
    period: string,
    createdBy: string
  ): Promise<Payroll> {
    const employee = await getDoc(doc(db, 'employees', employeeId));
    
    if (!employee.exists()) {
      throw new Error('Employee not found');
    }
    
    const employeeData = employee.data() as Employee;
    
    // Calculate payroll based on attendance and salary
    const [year, month] = period.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    
    const attendance = await this.getAttendanceByEmployee(employeeId, startDate, endDate);
    
    const totalHours = attendance.reduce((sum, record) => sum + record.totalHours, 0);
    const overtimeHours = attendance.reduce((sum, record) => sum + record.overtime, 0);
    
    // Calculate basic salary (assuming monthly salary)
    const basicSalary = employeeData.salary;
    const overtimePay = overtimeHours * (employeeData.salary / 160) * 1.5; // 1.5x overtime rate
    
    // Calculate deductions (simplified - should be configurable)
    const taxes = basicSalary * 0.1; // 10% tax
    const grossPay = basicSalary + overtimePay;
    const netPay = grossPay - taxes;
    
    const payrollData: Omit<Payroll, 'id' | 'createdAt' | 'updatedAt'> = {
      orgId,
      employeeId,
      period,
      basicSalary,
      bonuses: 0,
      deductions: taxes,
      overtime: overtimePay,
      grossPay,
      taxes,
      netPay,
      currency: employeeData.currency,
      status: 'draft',
      createdBy
    };
    
    const docRef = await addDoc(collection(db, 'payroll'), {
      ...payrollData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...payrollData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async approvePayroll(payrollId: string): Promise<void> {
    const payrollDoc = await getDoc(doc(db, 'payroll', payrollId));
    
    if (!payrollDoc.exists()) {
      throw new Error('Payroll not found');
    }
    
    const payroll = payrollDoc.data() as Payroll;
    
    await updateDoc(doc(db, 'payroll', payrollId), {
      status: 'approved',
      updatedAt: new Date()
    });
    
    // Create accounting entry for payroll
    await this.createPayrollAccountingEntry(payroll);
  }

  private static async createPayrollAccountingEntry(payroll: Payroll): Promise<void> {
    // This would create the appropriate accounting entries
    // Debit: Payroll Expense
    // Credit: Payroll Payable, Tax Payable, etc.
    
    // Implementation would depend on chart of accounts setup
    // For now, just a placeholder
    console.log('Creating payroll accounting entry for:', payroll.id);
  }

  static async payEmployee(payrollId: string): Promise<void> {
    await updateDoc(doc(db, 'payroll', payrollId), {
      status: 'paid',
      payDate: new Date(),
      updatedAt: new Date()
    });
  }

  static async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    const q = query(
      collection(db, 'payroll'),
      where('employeeId', '==', employeeId),
      orderBy('period', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Payroll));
  }

  static async getPayrollByOrganization(orgId: string, period?: string): Promise<Payroll[]> {
    let q = query(
      collection(db, 'payroll'),
      where('orgId', '==', orgId),
      orderBy('period', 'desc')
    );
    
    if (period) {
      q = query(q, where('period', '==', period));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Payroll));
  }

  // HR Analytics
  static async getHRStats(orgId: string): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    pendingLeaves: number;
    totalPayroll: number;
    avgSalary: number;
  }> {
    const employees = await this.getEmployeesByOrganization(orgId);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const payroll = await this.getPayrollByOrganization(orgId, currentMonth);
    
    const leaveQuery = query(
      collection(db, 'leaveRequests'),
      where('orgId', '==', orgId),
      where('status', '==', 'pending')
    );
    const leaveSnapshot = await getDocs(leaveQuery);
    
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      pendingLeaves: leaveSnapshot.size,
      totalPayroll: payroll.reduce((sum, p) => sum + p.netPay, 0),
      avgSalary: employees.length > 0 ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length : 0
    };
  }
}