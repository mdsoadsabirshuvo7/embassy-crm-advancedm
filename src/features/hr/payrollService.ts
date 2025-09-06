import { v4 as uuid } from 'uuid';

export interface PayrollComponent {
  id: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  amount: number; // fixed for scaffold
  currency: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  period: string; // YYYY-MM
  components: PayrollComponent[];
  gross: number;
  net: number;
  currency: string;
  generatedAt: string;
  orgId?: string;
}

interface PayrollState { payslips: Payslip[]; }
const state: Record<string, PayrollState> = {};
function ensure(orgId: string): PayrollState { return state[orgId] ||= { payslips: [] }; }

export const PayrollService = {
  generate(orgId: string, employeeId: string, period: string, baseSalary: number, currency: string): Payslip {
    const earnings: PayrollComponent[] = [ { id: uuid(), name: 'Base Salary', type: 'EARNING', amount: baseSalary, currency } ];
    const deductions: PayrollComponent[] = [ { id: uuid(), name: 'Tax', type: 'DEDUCTION', amount: baseSalary * 0.1, currency } ];
    const components = [...earnings, ...deductions];
    const gross = earnings.reduce((s,c)=>s+c.amount,0);
    const net = gross - deductions.reduce((s,c)=>s+c.amount,0);
    const slip: Payslip = { id: uuid(), employeeId, period, components, gross, net, currency, generatedAt: new Date().toISOString(), orgId };
    ensure(orgId).payslips.push(slip);
    return slip;
  },
  list(orgId: string, period?: string): Payslip[] { return ensure(orgId).payslips.filter(p => !period || p.period === period); }
};
