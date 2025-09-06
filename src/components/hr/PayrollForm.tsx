import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types/database';

interface PayrollData {
  id?: string;
  orgId: string;
  employeeId: string;
  period: string;
  basicSalary: number;
  bonuses: number;
  deductions: number;
  overtime: number;
  grossPay: number;
  taxes: number;
  netPay: number;
  currency: 'BDT' | 'USD';
  status: 'draft' | 'approved' | 'paid';
  createdBy: string;
}

interface PayrollFormProps {
  payroll?: PayrollData;
  employees: Employee[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payrollData: Partial<PayrollData>) => void;
}

export const PayrollForm: React.FC<PayrollFormProps> = ({
  payroll,
  employees,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    employeeId: payroll?.employeeId || '',
    period: payroll?.period || new Date().toISOString().slice(0, 7), // YYYY-MM
    basicSalary: payroll?.basicSalary || 0,
    bonuses: payroll?.bonuses || 0,
    deductions: payroll?.deductions || 0,
    overtime: payroll?.overtime || 0,
    taxes: payroll?.taxes || 0,
    currency: payroll?.currency || 'BDT' as 'BDT' | 'USD',
    status: payroll?.status || 'draft' as 'draft' | 'approved' | 'paid'
  });

  // Calculate gross pay and net pay when values change
  React.useEffect(() => {
    const grossPay = formData.basicSalary + formData.bonuses + formData.overtime;
    const netPay = grossPay - formData.deductions - formData.taxes;
    
    setFormData(prev => ({
      ...prev,
      grossPay,
      netPay
    }));
  }, [formData.basicSalary, formData.bonuses, formData.overtime, formData.deductions, formData.taxes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const grossPay = formData.basicSalary + formData.bonuses + formData.overtime;
    const netPay = grossPay - formData.deductions - formData.taxes;
    
    const payrollData: Partial<PayrollData> = {
      orgId: 'demo-org',
      employeeId: formData.employeeId,
      period: formData.period,
      basicSalary: formData.basicSalary,
      bonuses: formData.bonuses,
      deductions: formData.deductions,
      overtime: formData.overtime,
      grossPay,
      taxes: formData.taxes,
      netPay,
      currency: formData.currency,
      status: formData.status,
      createdBy: 'current-user'
    };

    onSubmit(payrollData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

  // Auto-populate basic salary when employee is selected
  React.useEffect(() => {
    if (selectedEmployee && !payroll) {
      setFormData(prev => ({
        ...prev,
        basicSalary: selectedEmployee.salary,
        currency: selectedEmployee.currency,
        taxes: Math.round(selectedEmployee.salary * 0.1) // 10% tax rate
      }));
    }
  }, [selectedEmployee, payroll]);

  const grossPay = formData.basicSalary + formData.bonuses + formData.overtime;
  const netPay = grossPay - formData.deductions - formData.taxes;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payroll ? 'Edit Payroll' : 'Generate Payroll'}</DialogTitle>
          <DialogDescription>
            {payroll ? 'Update payroll information' : 'Create payroll for an employee'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee</Label>
              <Select 
                value={formData.employeeId} 
                onValueChange={(value) => handleChange('employeeId', value)}
                disabled={!!payroll}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.employeeId} - {employee.userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Pay Period (YYYY-MM)</Label>
              <Input
                id="period"
                type="month"
                value={formData.period}
                onChange={(e) => handleChange('period', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary</Label>
              <Input
                id="basicSalary"
                type="number"
                step="0.01"
                value={formData.basicSalary}
                onChange={(e) => handleChange('basicSalary', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonuses">Bonuses</Label>
              <Input
                id="bonuses"
                type="number"
                step="0.01"
                value={formData.bonuses}
                onChange={(e) => handleChange('bonuses', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime">Overtime Pay</Label>
              <Input
                id="overtime"
                type="number"
                step="0.01"
                value={formData.overtime}
                onChange={(e) => handleChange('overtime', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxes">Taxes</Label>
              <Input
                id="taxes"
                type="number"
                step="0.01"
                value={formData.taxes}
                onChange={(e) => handleChange('taxes', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductions">Other Deductions</Label>
              <Input
                id="deductions"
                type="number"
                step="0.01"
                value={formData.deductions}
                onChange={(e) => handleChange('deductions', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Calculation Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Gross Pay:</span>
                <span className="font-mono">{formData.currency === 'BDT' ? '৳' : '$'}{grossPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deductions:</span>
                <span className="font-mono">{formData.currency === 'BDT' ? '৳' : '$'}{(formData.deductions + formData.taxes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Net Pay:</span>
                <span className="font-mono">{formData.currency === 'BDT' ? '৳' : '$'}{netPay.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {payroll ? 'Update Payroll' : 'Generate Payroll'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};