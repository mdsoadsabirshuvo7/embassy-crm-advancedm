import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportOptions {
  filename: string;
  title: string;
  headers: string[];
  data: any[];
  format: ExportFormat;
  includeDate?: boolean;
}

export class ExportService {
  static async exportData(options: ExportOptions): Promise<void> {
    const { format, filename, title, headers, data, includeDate = true } = options;
    
    const timestamp = includeDate ? `_${new Date().toISOString().split('T')[0]}` : '';
    const finalFilename = `${filename}${timestamp}`;

    switch (format) {
      case 'pdf':
        this.exportToPDF(finalFilename, title, headers, data);
        break;
      case 'excel':
        this.exportToExcel(finalFilename, title, headers, data);
        break;
      case 'csv':
        this.exportToCSV(finalFilename, headers, data);
        break;
    }
  }

  private static exportToPDF(filename: string, title: string, headers: string[], data: any[]): void {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    let yPosition = 45;
    
    // Add headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const columnWidth = 180 / headers.length;
    headers.forEach((header, index) => {
      doc.text(header, 20 + (index * columnWidth), yPosition);
    });
    
    yPosition += 10;
    
    // Add data rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    data.forEach((row) => {
      if (yPosition > 270) { // Start new page if needed
        doc.addPage();
        yPosition = 20;
      }
      
      headers.forEach((header, index) => {
        const cellData = ExportService.getCellValue(row, header);
        const text = typeof cellData === 'object' ? JSON.stringify(cellData) : String(cellData);
        doc.text(text.substring(0, 20), 20 + (index * columnWidth), yPosition);
      });
      
      yPosition += 8;
    });
    
    doc.save(`${filename}.pdf`);
  }

  private static exportToExcel(filename: string, title: string, headers: string[], data: any[]): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    // Add title row
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(worksheet, [[`Generated on: ${new Date().toLocaleDateString()}`]], { origin: 'A2' });
    
    // Set column widths
    const colWidths = headers.map(() => ({ wch: 20 }));
    worksheet['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  private static exportToCSV(filename: string, headers: string[], data: any[]): void {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const cellData = ExportService.getCellValue(row, header);
          const text = typeof cellData === 'object' ? JSON.stringify(cellData) : String(cellData);
          return `"${text.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  }

  // Specialized export methods for different data types
  static async exportEmployees(employees: any[], format: ExportFormat): Promise<void> {
    const headers = ['Name', 'Email', 'Employee ID', 'Department', 'Position', 'Salary', 'Status', 'Join Date'];
    const data = employees.map(emp => ({
      'Name': emp.name,
      'Email': emp.email,
      'Employee ID': emp.id,
      'Department': emp.department,
      'Position': emp.position,
      'Salary': emp.salary,
      'Status': emp.status,
      'Join Date': emp.joinDate
    }));

    return this.exportData({
      filename: 'employees',
      title: 'Employee Directory',
      headers,
      data,
      format
    });
  }

  static async exportPayroll(payroll: any[], format: ExportFormat): Promise<void> {
    const headers = ['Employee', 'Base Salary', 'Bonus', 'Deductions', 'Net Pay', 'Status'];
    const data = payroll.map(p => ({
      'Employee': p.employee,
      'Base Salary': p.baseSalary,
      'Bonus': p.bonus,
      'Deductions': p.deductions,
      'Net Pay': p.netPay,
      'Status': p.status
    }));

    return this.exportData({
      filename: 'payroll',
      title: 'Payroll Report',
      headers,
      data,
      format
    });
  }

  static async exportLeaveRequests(leaves: any[], format: ExportFormat): Promise<void> {
    const headers = ['Request ID', 'Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason'];
    const data = leaves.map(leave => ({
      'Request ID': leave.id,
      'Employee': leave.employee,
      'Type': leave.type,
      'Start Date': leave.startDate,
      'End Date': leave.endDate,
      'Days': leave.days,
      'Status': leave.status,
      'Reason': leave.reason
    }));

    return this.exportData({
      filename: 'leave_requests',
      title: 'Leave Requests Report',
      headers,
      data,
      format
    });
  }

  static async exportDepartments(departments: any[], format: ExportFormat): Promise<void> {
    const headers = ['Name', 'Description', 'Manager', 'Employee Count', 'Budget', 'Status'];
    const data = departments.map(dept => ({
      'Name': dept.name,
      'Description': dept.description,
      'Manager': dept.managerName || 'Not Assigned',
      'Employee Count': dept.employeeCount,
      'Budget': dept.budget,
      'Status': dept.isActive ? 'Active' : 'Inactive'
    }));

    return this.exportData({
      filename: 'departments',
      title: 'Departments Report',
      headers,
      data,
      format
    });
  }

  // Heuristic mapping to resolve header labels to object keys
  private static getCellValue(row: any, header: string): any {
    if (!row) return '';

    if (header in row) return row[header];

    const lowerHeader = header.toLowerCase();
    const byLower = Object.keys(row).find(k => k.toLowerCase() === lowerHeader);
    if (byLower) return row[byLower];

    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const headerNorm = norm(header);

    const exact = Object.keys(row).find(k => norm(k) === headerNorm);
    if (exact) return row[exact];

    const partial = Object.keys(row).find(k => {
      const nk = norm(k);
      return nk.includes(headerNorm) || headerNorm.includes(nk);
    });
    if (partial) return row[partial];

    return '';
  }
}
