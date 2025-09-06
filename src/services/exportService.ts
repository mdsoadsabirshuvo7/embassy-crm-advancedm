// Heavy libraries (jsPDF, xlsx) are loaded on demand via dynamic import to reduce initial bundle size
import { saveAs } from 'file-saver';

export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportOptions<Row extends Record<string, unknown> = Record<string, unknown>> {
  filename: string;
  title: string;
  headers: string[]; // Ordered list of column headers expected to map to row keys or heuristics
  data: Row[];       // Array of homogeneous row objects
  format: ExportFormat;
  includeDate?: boolean;
}

export class ExportService {
  static async exportData<Row extends Record<string, unknown>>(options: ExportOptions<Row>): Promise<void> {
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

  private static async exportToPDF<Row extends Record<string, unknown>>(filename: string, title: string, headers: string[], data: Row[]): Promise<void> {
    const { default: jsPDF } = await import('jspdf');
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

  private static async exportToExcel<Row extends Record<string, unknown>>(filename: string, title: string, headers: string[], data: Row[]): Promise<void> {
    const XLSX = await import('xlsx');
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

  private static exportToCSV<Row extends Record<string, unknown>>(filename: string, headers: string[], data: Row[]): void {
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
  static async exportEmployees(employees: Array<{
    name: string; email: string; id: string; department: string; position: string; salary: number; status: string; joinDate: string | Date;
  }>, format: ExportFormat): Promise<void> {
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

  static async exportPayroll(payroll: Array<{
    employee: string; baseSalary: number; bonus: number; deductions: number; netPay: number; status: string;
  }>, format: ExportFormat): Promise<void> {
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

  static async exportLeaveRequests(leaves: Array<{
    id: string; employee: string; type: string; startDate: string | Date; endDate: string | Date; days: number; status: string; reason: string;
  }>, format: ExportFormat): Promise<void> {
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

  static async exportDepartments(departments: Array<{
    name: string; description: string; managerName?: string; employeeCount: number; budget: number; isActive: boolean;
  }>, format: ExportFormat): Promise<void> {
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

  static async exportClients(clients: Array<{ name: string; email: string; phone: string; company?: string; nationality: string; status: string; assignedTo: string; }>, format: ExportFormat): Promise<void> {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Nationality', 'Status', 'Assigned To'];
    const data = clients.map(client => ({
      'Name': client.name,
      'Email': client.email,
      'Phone': client.phone,
      'Company': client.company || 'N/A',
      'Nationality': client.nationality,
      'Status': client.status,
      'Assigned To': client.assignedTo
    }));
    return this.exportData({ filename: 'clients', title: 'Clients Report', headers, data, format });
  }

  static async exportInvoices(invoices: Array<{ number: string; clientName: string; issueDate: string | Date; dueDate: string | Date; total: number; status: string; }>, format: ExportFormat): Promise<void> {
    const headers = ['Invoice Number', 'Client', 'Issue Date', 'Due Date', 'Amount', 'Status'];
    const data = invoices.map(inv => ({
      'Invoice Number': inv.number,
      'Client': inv.clientName,
      'Issue Date': inv.issueDate,
      'Due Date': inv.dueDate,
      'Amount': inv.total,
      'Status': inv.status
    }));
    return this.exportData({ filename: 'invoices', title: 'Invoices Report', headers, data, format });
  }

  static async exportExpensesGeneric(expenses: Array<{ description: string; amount: number; category: string; date: string | Date; employee: string; status: string; }>, format: ExportFormat): Promise<void> {
    const headers = ['Description', 'Amount', 'Category', 'Date', 'Employee', 'Status'];
    const data = expenses.map(exp => ({
      'Description': exp.description,
      'Amount': exp.amount,
      'Category': exp.category,
      'Date': exp.date,
      'Employee': exp.employee,
      'Status': exp.status
    }));
    return this.exportData({ filename: 'expenses', title: 'Expenses Report', headers, data, format });
  }

  static async exportTasks(tasks: Array<{ title: string; assignedTo: string; priority: string; status: string; dueDate: string | Date; clientName?: string; }>, format: ExportFormat): Promise<void> {
    const headers = ['Title', 'Assigned To', 'Priority', 'Status', 'Due Date', 'Client'];
    const data = tasks.map(task => ({
      'Title': task.title,
      'Assigned To': task.assignedTo,
      'Priority': task.priority,
      'Status': task.status,
      'Due Date': task.dueDate,
      'Client': task.clientName || 'N/A'
    }));
    return this.exportData({ filename: 'tasks', title: 'Tasks Report', headers, data, format });
  }

  // Heuristic mapping to resolve header labels to object keys
  private static getCellValue(row: Record<string, unknown>, header: string): unknown {
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
