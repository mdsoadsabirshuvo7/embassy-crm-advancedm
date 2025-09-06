import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AccountingService } from '@/services/accountingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  CreditCard, 
  FileText,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  BarChart3
} from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExportDropdown } from '@/components/export/ExportDropdown';
import { ExportService } from '@/services/exportService';

const AccountingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  interface AccountSummary { id: string; name: string; type: string; balance: string; status: string }
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTxnOpen, setIsTxnOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [newTxn, setNewTxn] = useState({ date: '', description: '', account: '', debit: '', credit: '' });
  const [newAccount, setNewAccount] = useState({ code: '', name: '', type: 'asset', balance: '0.00' });
  const [newInvoice, setNewInvoice] = useState({ client: '', amount: '', dueDate: '', currency: 'BDT' });
  const { user, organization } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user || !organization) return;
      
      try {
        const accountsData = await AccountingService.getAccountsByOrganization(organization.id);
        // Map service accounts to summary (adding status if absent)
        setAccounts(accountsData.map(a => ({
          id: a.id,
            name: a.name,
            type: a.type,
            balance: typeof a.balance === 'number' ? a.balance.toFixed(2) : String(a.balance),
            status: (a as { status?: string }).status || 'active'
        })));
      } catch (error) {
        console.error('Error loading accounting data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, organization]);

  // Default mock data for demo
  const defaultAccounts = [
    { id: '1000', name: 'Cash - Main Account', type: 'Asset', balance: '25,420.00', status: 'active' },
    { id: '1200', name: 'Accounts Receivable', type: 'Asset', balance: '18,750.00', status: 'active' },
    { id: '2000', name: 'Accounts Payable', type: 'Liability', balance: '8,230.00', status: 'active' },
    { id: '3000', name: 'Service Revenue', type: 'Revenue', balance: '45,680.00', status: 'active' },
    { id: '4000', name: 'Office Expenses', type: 'Expense', balance: '3,420.00', status: 'active' },
  ];

  const invoices = [
    { id: 'INV-001', client: 'Ahmed Hassan', amount: '2,500.00', status: 'paid', dueDate: '2024-01-15', currency: 'BDT' },
    { id: 'INV-002', client: 'Maria Santos', amount: '1,800.00', status: 'pending', dueDate: '2024-01-20', currency: 'USD' },
    { id: 'INV-003', client: 'John Smith', amount: '3,200.00', status: 'overdue', dueDate: '2024-01-10', currency: 'BDT' },
    { id: 'INV-004', client: 'Sarah Ahmed', amount: '1,500.00', status: 'draft', dueDate: '2024-01-25', currency: 'USD' },
  ];

  const [transactions, setTransactions] = useState([
    { id: 'TXN-001', date: '2024-01-15', description: 'Payment received from Ahmed Hassan', debit: '', credit: '2,500.00', account: 'Cash - Main Account' },
    { id: 'TXN-002', date: '2024-01-14', description: 'Office rent payment', debit: '1,200.00', credit: '', account: 'Office Expenses' },
    { id: 'TXN-003', date: '2024-01-13', description: 'Service revenue - Visa processing', debit: '', credit: '1,800.00', account: 'Service Revenue' },
  ]);

  const exportTxnRows = transactions.map(t => ({
    'Transaction ID': t.id,
    'Date': t.date,
    'Description': t.description,
    'Account': t.account,
    'Debit': t.debit,
    'Credit': t.credit,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleTxnChange = (field: string, value: string) => {
    setNewTxn((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTxn = () => {
    const id = `TXN-${String(transactions.length + 1).padStart(3, '0')}`;
    setTransactions((prev) => [
      {
        id,
        date: newTxn.date || new Date().toISOString().split('T')[0],
        description: newTxn.description,
        account: newTxn.account,
        debit: newTxn.debit,
        credit: newTxn.credit,
      },
      ...prev,
    ]);
    setIsTxnOpen(false);
    setNewTxn({ date: '', description: '', account: '', debit: '', credit: '' });
  };

  const handleAddAccount = () => {
    const newAccountData = {
      id: newAccount.code,
      name: newAccount.name,
      type: newAccount.type,
      balance: newAccount.balance,
      status: 'active'
    };
    setAccounts((prev) => [...prev, newAccountData]);
    setIsAccountOpen(false);
    setNewAccount({ code: '', name: '', type: 'asset', balance: '0.00' });
  };

  const handleAddInvoice = () => {
    const id = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoiceData = {
      id,
      client: newInvoice.client,
      amount: newInvoice.amount,
      dueDate: newInvoice.dueDate,
      currency: newInvoice.currency,
      status: 'draft'
    };
    // Note: In a real app, you'd update the invoices array or call a service
    console.log('New invoice created:', newInvoiceData);
    setIsInvoiceOpen(false);
    setNewInvoice({ client: '', amount: '', dueDate: '', currency: 'BDT' });
  };

  const generateReport = async (reportType: string, format: 'excel' | 'pdf' | 'csv' | 'word' = 'excel') => {
    if (!organization) return;
    
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // Last month
      
  let reportData: { title: string; period?: string; asOf?: string; organization: string; data: (string)[][] } = { title: '', organization: organization.name, data: [] };
      let filename = '';
      let headers: string[] = [];
  let rows: string[][] = [];
      
      switch (reportType) {
        case 'profit-loss': {
          const plReport = await AccountingService.generateProfitAndLoss(organization.id, startDate, endDate);
          filename = `profit-loss-${new Date().toISOString().split('T')[0]}`;
          headers = ['Account', 'Amount'];
          rows.push(['REVENUE', '']);
          plReport.revenue.forEach(item => rows.push([item.account.name, item.amount.toFixed(2)]));
          rows.push(['Total Revenue', plReport.totalRevenue.toFixed(2)]);
          rows.push(['', '']);
          rows.push(['EXPENSES', '']);
          plReport.expenses.forEach(item => rows.push([item.account.name, item.amount.toFixed(2)]));
          rows.push(['Total Expenses', plReport.totalExpenses.toFixed(2)]);
          rows.push(['', '']);
          rows.push(['NET INCOME', plReport.netIncome.toFixed(2)]);
          reportData = { title: 'Profit & Loss Statement', period: `${startDate.toDateString()} to ${endDate.toDateString()}`, organization: organization.name, data: rows };
          break;
        }
        case 'balance-sheet': {
          const bsReport = await AccountingService.generateBalanceSheet(organization.id, endDate);
          filename = `balance-sheet-${new Date().toISOString().split('T')[0]}`;
          headers = ['Account', 'Amount'];
          rows.push(['ASSETS', '']);
            bsReport.assets.forEach(item => rows.push([item.account.name, item.amount.toFixed(2)]));
          rows.push(['Total Assets', bsReport.totalAssets.toFixed(2)]);
          rows.push(['', '']);
          rows.push(['LIABILITIES', '']);
            bsReport.liabilities.forEach(item => rows.push([item.account.name, item.amount.toFixed(2)]));
          rows.push(['Total Liabilities', bsReport.totalLiabilities.toFixed(2)]);
          rows.push(['', '']);
          rows.push(['EQUITY', '']);
            bsReport.equity.forEach(item => rows.push([item.account.name, item.amount.toFixed(2)]));
          rows.push(['Total Equity', bsReport.totalEquity.toFixed(2)]);
          reportData = { title: 'Balance Sheet', asOf: endDate.toDateString(), organization: organization.name, data: rows };
          break;
        }
        case 'trial-balance': {
          const tbReport = await AccountingService.generateTrialBalance(organization.id, endDate);
          filename = `trial-balance-${new Date().toISOString().split('T')[0]}`;
          headers = ['Account Code', 'Account Name', 'Debit', 'Credit', 'Balance'];
          tbReport.accounts.forEach(item => rows.push([
            item.account.code || item.account.id,
            item.account.name,
            item.debit.toFixed(2),
            item.credit.toFixed(2),
            item.balance.toFixed(2)
          ]));
          rows.push(['', '', '', '', '']);
          rows.push(['TOTALS', '', tbReport.totalDebits.toFixed(2), tbReport.totalCredits.toFixed(2), '']);
          reportData = { title: 'Trial Balance', asOf: endDate.toDateString(), organization: organization.name, data: rows };
          break;
        }
        case 'cash-flow': {
          filename = `cash-flow-${new Date().toISOString().split('T')[0]}`;
          headers = ['Category', 'Amount'];
          rows = [
            ['Operating Activities', '15,000.00'],
            ['Investing Activities', '-5,000.00'],
            ['Financing Activities', '10,000.00'],
            ['Net Cash Flow', '20,000.00']
          ];
          reportData = { title: 'Cash Flow Statement', period: `${startDate.toDateString()} to ${endDate.toDateString()}`, organization: organization.name, data: rows };
          break;
        }
        case 'aged-receivables': {
          filename = `aged-receivables-${new Date().toISOString().split('T')[0]}`;
          headers = ['Customer', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Total'];
          rows = [
            ['Ahmed Hassan', '0.00', '2,500.00', '0.00', '0.00', '0.00', '2,500.00'],
            ['Maria Santos', '1,800.00', '0.00', '0.00', '0.00', '0.00', '1,800.00'],
            ['John Smith', '0.00', '0.00', '3,200.00', '0.00', '0.00', '3,200.00'],
            ['TOTALS', '1,800.00', '2,500.00', '3,200.00', '0.00', '0.00', '7,500.00']
          ];
          reportData = { title: 'Aged Receivables Report', asOf: endDate.toDateString(), organization: organization.name, data: rows };
          break;
        }
        case 'aged-payables': {
          filename = `aged-payables-${new Date().toISOString().split('T')[0]}`;
          headers = ['Vendor', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Total'];
          rows = [
            ['Office Supplies Co.', '500.00', '0.00', '0.00', '0.00', '0.00', '500.00'],
            ['Utility Company', '300.00', '150.00', '0.00', '0.00', '0.00', '450.00'],
            ['TOTALS', '800.00', '150.00', '0.00', '0.00', '0.00', '950.00']
          ];
          reportData = { title: 'Aged Payables Report', asOf: endDate.toDateString(), organization: organization.name, data: rows };
          break;
        }
      }
      
      // Export based on format
      const exportData = {
        filename: filename,
        title: reportData.title,
        headers: headers,
        data: rows.map(row => headers.reduce<Record<string,string>>((acc, header, index) => {
          acc[header] = row[index] || '';
          return acc;
        }, {})),
        format: format as 'pdf' | 'excel' | 'csv'
      };

      if (format === 'word') {
        // For Word format, create a simple text document
        const wordContent = [
          reportData.title,
          reportData.period || reportData.asOf || '',
          reportData.organization,
          '',
          headers.join('\t'),
          ...rows.map(row => row.join('\t'))
        ].join('\n');
        
        const blob = new Blob([wordContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        await ExportService.exportData(exportData);
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use default accounts if accounts array is empty
  const displayAccounts = accounts.length > 0 ? accounts : defaultAccounts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
          <p className="text-muted-foreground">
            QuickBooks-level accounting with multi-currency support
          </p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            data={exportTxnRows}
            filename="transactions"
            title="Transactions"
            headers={["Transaction ID", "Date", "Description", "Account", "Debit", "Credit"]}
          />
          <Button size="sm" onClick={() => setIsTxnOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      <Dialog open={isTxnOpen} onOpenChange={setIsTxnOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={newTxn.date} onChange={(e) => handleTxnChange('date', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" value={newTxn.description} onChange={(e) => handleTxnChange('description', e.target.value)} placeholder="e.g. Office rent payment" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Input id="account" value={newTxn.account} onChange={(e) => handleTxnChange('account', e.target.value)} placeholder="e.g. Cash - Main Account" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debit">Debit</Label>
              <Input id="debit" value={newTxn.debit} onChange={(e) => handleTxnChange('debit', e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit">Credit</Label>
              <Input id="credit" value={newTxn.credit} onChange={(e) => handleTxnChange('credit', e.target.value)} placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTxnOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTxn}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account-code">Account Code</Label>
              <Input 
                id="account-code" 
                value={newAccount.code} 
                onChange={(e) => setNewAccount(prev => ({...prev, code: e.target.value}))} 
                placeholder="e.g. 1000" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-type">Account Type</Label>
              <Select 
                value={newAccount.type} 
                onValueChange={(value) => setNewAccount(prev => ({...prev, type: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">Asset</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input 
                id="account-name" 
                value={newAccount.name} 
                onChange={(e) => setNewAccount(prev => ({...prev, name: e.target.value}))} 
                placeholder="e.g. Cash - Main Account" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initial-balance">Initial Balance</Label>
              <Input 
                id="initial-balance" 
                value={newAccount.balance} 
                onChange={(e) => setNewAccount(prev => ({...prev, balance: e.target.value}))} 
                placeholder="0.00" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAccountOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Invoice Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input 
                id="client-name" 
                value={newInvoice.client} 
                onChange={(e) => setNewInvoice(prev => ({...prev, client: e.target.value}))} 
                placeholder="e.g. John Doe" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                value={newInvoice.amount} 
                onChange={(e) => setNewInvoice(prev => ({...prev, amount: e.target.value}))} 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={newInvoice.currency} 
                onValueChange={(value) => setNewInvoice(prev => ({...prev, currency: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input 
                id="due-date" 
                type="date" 
                value={newInvoice.dueDate} 
                onChange={(e) => setNewInvoice(prev => ({...prev, dueDate: e.target.value}))} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>Cancel</Button>
            <Button onClick={handleAddInvoice}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳44,170.00</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding A/R</CardTitle>
            <Receipt className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳18,750.00</div>
            <p className="text-xs text-warning">3 pending invoices</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳45,680.00</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳3,420.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profit & Loss Summary</CardTitle>
                <CardDescription>Current month overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <span className="text-sm font-bold text-success">৳45,680.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Expenses</span>
                  <span className="text-sm font-bold text-destructive">৳3,420.00</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Net Profit</span>
                  <span className="font-bold text-success">৳42,260.00</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Balance Sheet Summary</CardTitle>
                <CardDescription>As of today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Assets</span>
                  <span className="text-sm font-bold">৳44,170.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Liabilities</span>
                  <span className="text-sm font-bold">৳8,230.00</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Net Worth</span>
                  <span className="font-bold text-success">৳35,940.00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chart of Accounts</CardTitle>
                  <CardDescription>Manage your account structure</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsAccountOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono">{account.id}</TableCell>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell className="capitalize">{account.type}</TableCell>
                      <TableCell className="font-mono">৳{account.balance}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {account.status}
                        </Badge>
                      </TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="sm" onClick={() => console.log('View account', account.id)}>
                             <Eye className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => console.log('Edit account', account.id)}>
                             <Edit className="w-4 h-4" />
                           </Button>
                         </div>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage client invoices and payments</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" onClick={() => setIsInvoiceOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Invoice
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.id}</TableCell>
                      <TableCell className="font-medium">{invoice.client}</TableCell>
                      <TableCell className="font-mono">{invoice.amount}</TableCell>
                      <TableCell>{invoice.currency}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="sm" onClick={() => console.log('View invoice', invoice.id)}>
                             <Eye className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => console.log('Edit invoice', invoice.id)}>
                             <Edit className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => console.log('Download invoice', invoice.id)}>
                             <Download className="w-4 h-4" />
                           </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>General Ledger</CardTitle>
                  <CardDescription>All accounting transactions</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsTxnOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.account}</TableCell>
                      <TableCell className="font-mono text-destructive">
                        {transaction.debit ? `৳${transaction.debit}` : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-success">
                        {transaction.credit ? `৳${transaction.credit}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Profit & Loss
                </CardTitle>
                <CardDescription>Income statement for selected period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('profit-loss', 'excel')}>Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('profit-loss', 'pdf')}>PDF</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('profit-loss', 'csv')}>CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('profit-loss', 'word')}>Word</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Balance Sheet
                </CardTitle>
                <CardDescription>Financial position statement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('balance-sheet', 'excel')}>Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('balance-sheet', 'pdf')}>PDF</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('balance-sheet', 'csv')}>CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('balance-sheet', 'word')}>Word</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Trial Balance
                </CardTitle>
                <CardDescription>Account balances verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('trial-balance', 'excel')}>Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('trial-balance', 'pdf')}>PDF</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('trial-balance', 'csv')}>CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('trial-balance', 'word')}>Word</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Cash Flow
                </CardTitle>
                <CardDescription>Cash movement analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('cash-flow', 'excel')}>Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('cash-flow', 'pdf')}>PDF</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('cash-flow', 'csv')}>CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('cash-flow', 'word')}>Word</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Aged Receivables
                </CardTitle>
                <CardDescription>Outstanding customer payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-receivables', 'excel')}>Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-receivables', 'pdf')}>PDF</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-receivables', 'csv')}>CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-receivables', 'word')}>Word</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Aged Payables
                </CardTitle>
                <CardDescription>Outstanding vendor payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-payables', 'excel')}>Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-payables', 'pdf')}>PDF</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-payables', 'csv')}>CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => generateReport('aged-payables', 'word')}>Word</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingPage;