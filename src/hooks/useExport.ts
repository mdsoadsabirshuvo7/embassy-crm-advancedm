import { useState } from 'react';
import { ExportService, ExportFormat } from '@/services/exportService';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async <Row extends Record<string, unknown>>( 
    data: Row[],
    filename: string,
    title: string,
    headers: string[],
    format: ExportFormat
  ) => {
    setIsExporting(true);
    try {
      await ExportService.exportData({
        filename,
        title,
        headers,
        data,
        format
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportEmployees = async (employees: Array<{ name: string; email: string; id: string; department: string; position: string; salary: number; status: string; joinDate: string | Date; }>, format: ExportFormat) => {
    return ExportService.exportEmployees(employees, format);
  };

  const exportPayroll = async (payroll: Array<{ employee: string; baseSalary: number; bonus: number; deductions: number; netPay: number; status: string; }>, format: ExportFormat) => {
    return ExportService.exportPayroll(payroll, format);
  };

  const exportLeaveRequests = async (leaves: Array<{ id: string; employee: string; type: string; startDate: string | Date; endDate: string | Date; days: number; status: string; reason: string; }>, format: ExportFormat) => {
    return ExportService.exportLeaveRequests(leaves, format);
  };

  const exportDepartments = async (departments: Array<{ name: string; description: string; managerName?: string; employeeCount: number; budget: number; isActive: boolean; }>, format: ExportFormat) => {
    return ExportService.exportDepartments(departments, format);
  };

  // Universal exports for other modules
  const exportClients = (clients: Array<{ name: string; email: string; phone: string; company?: string; nationality: string; status: string; assignedTo: string; }>, format: ExportFormat) => ExportService.exportClients(clients, format);

  const exportInvoices = (invoices: Array<{ number: string; clientName: string; issueDate: string | Date; dueDate: string | Date; total: number; status: string; }>, format: ExportFormat) => ExportService.exportInvoices(invoices, format);

  const exportExpenses = (expenses: Array<{ description: string; amount: number; category: string; date: string | Date; employee: string; status: string; }>, format: ExportFormat) => ExportService.exportExpensesGeneric(expenses, format);

  const exportTasks = (tasks: Array<{ title: string; assignedTo: string; priority: string; status: string; dueDate: string | Date; clientName?: string; }>, format: ExportFormat) => ExportService.exportTasks(tasks, format);

  return {
    isExporting,
    exportData,
    exportEmployees,
    exportPayroll,
    exportLeaveRequests,
    exportDepartments,
    exportClients,
    exportInvoices,
    exportExpenses,
    exportTasks
  };
};