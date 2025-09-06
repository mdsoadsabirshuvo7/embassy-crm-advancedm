import { useState } from 'react';
import { ExportService, ExportFormat } from '@/services/exportService';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (
    data: any[],
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

  const exportEmployees = async (employees: any[], format: ExportFormat) => {
    return ExportService.exportEmployees(employees, format);
  };

  const exportPayroll = async (payroll: any[], format: ExportFormat) => {
    return ExportService.exportPayroll(payroll, format);
  };

  const exportLeaveRequests = async (leaves: any[], format: ExportFormat) => {
    return ExportService.exportLeaveRequests(leaves, format);
  };

  const exportDepartments = async (departments: any[], format: ExportFormat) => {
    return ExportService.exportDepartments(departments, format);
  };

  // Universal exports for other modules
  const exportClients = async (clients: any[], format: ExportFormat) => {
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

    return ExportService.exportData({
      filename: 'clients',
      title: 'Clients Report',
      headers,
      data,
      format
    });
  };

  const exportInvoices = async (invoices: any[], format: ExportFormat) => {
    const headers = ['Invoice Number', 'Client', 'Issue Date', 'Due Date', 'Amount', 'Status'];
    const data = invoices.map(invoice => ({
      'Invoice Number': invoice.number,
      'Client': invoice.clientName,
      'Issue Date': invoice.issueDate,
      'Due Date': invoice.dueDate,
      'Amount': invoice.total,
      'Status': invoice.status
    }));

    return ExportService.exportData({
      filename: 'invoices',
      title: 'Invoices Report',
      headers,
      data,
      format
    });
  };

  const exportExpenses = async (expenses: any[], format: ExportFormat) => {
    const headers = ['Description', 'Amount', 'Category', 'Date', 'Employee', 'Status'];
    const data = expenses.map(expense => ({
      'Description': expense.description,
      'Amount': expense.amount,
      'Category': expense.category,
      'Date': expense.date,
      'Employee': expense.employee,
      'Status': expense.status
    }));

    return ExportService.exportData({
      filename: 'expenses',
      title: 'Expenses Report',
      headers,
      data,
      format
    });
  };

  const exportTasks = async (tasks: any[], format: ExportFormat) => {
    const headers = ['Title', 'Assigned To', 'Priority', 'Status', 'Due Date', 'Client'];
    const data = tasks.map(task => ({
      'Title': task.title,
      'Assigned To': task.assignedTo,
      'Priority': task.priority,
      'Status': task.status,
      'Due Date': task.dueDate,
      'Client': task.clientName || 'N/A'
    }));

    return ExportService.exportData({
      filename: 'tasks',
      title: 'Tasks Report',
      headers,
      data,
      format
    });
  };

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