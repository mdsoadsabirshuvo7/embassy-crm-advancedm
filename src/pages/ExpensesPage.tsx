import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExport } from '@/hooks/useExport';
import { ExportDropdown } from '@/components/export/ExportDropdown';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExpenseEditModal } from '@/components/expense/ExpenseEditModal';
import { ExpenseViewModal } from '@/components/expense/ExpenseViewModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Expense } from '@/types/expense';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Receipt,
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FileText,
  Car,
  Utensils,
  Fuel,
  Home,
  Briefcase,
  Plane
} from 'lucide-react';

// Expense interface is now imported from types/expense.ts

const mockExpenses: Expense[] = [
  {
    id: '1',
    orgId: 'demo-org',
    description: 'Client meeting lunch',
    amount: 1200,
    currency: 'BDT',
    category: 'Meals',
    subcategory: 'Business Meals',
    date: '2024-01-20',
    paymentMethod: 'card',
    vendor: 'Restaurant ABC',
    receipt: 'receipt_001.jpg',
    status: 'approved',
    submittedBy: { id: '1', name: 'Sarah Ahmed' },
    approvedBy: { id: '2', name: 'Mike Manager' },
    project: 'Client Onboarding',
    billable: true,
    tags: ['client', 'meeting'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    description: 'Fuel for embassy visit',
    amount: 800,
    currency: 'BDT',
    category: 'Transportation',
    subcategory: 'Fuel',
    date: '2024-01-19',
    orgId: 'demo-org',
    paymentMethod: 'cash',
    vendor: 'Petrol Station XYZ',
    status: 'submitted',
    submittedBy: { id: '3', name: 'Mohammed Khan' },
    billable: true,
    tags: ['embassy', 'travel'],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '3',
    orgId: 'demo-org',
    description: 'Office supplies purchase',
    amount: 2500,
    currency: 'BDT',
    category: 'Office',
    subcategory: 'Supplies',
    date: '2024-01-18',
    paymentMethod: 'card',
    vendor: 'Office Mart',
    receipt: 'receipt_002.pdf',
    status: 'reimbursed',
    submittedBy: { id: '4', name: 'Fatima Rahman' },
    approvedBy: { id: '2', name: 'Mike Manager' },
    billable: false,
    tags: ['supplies', 'office'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '4',
    orgId: 'demo-org',
    description: 'International courier service',
    amount: 45,
    currency: 'USD',
    category: 'Shipping',
    subcategory: 'International',
    date: '2024-01-17',
    paymentMethod: 'bank_transfer',
    vendor: 'DHL Express',
    receipt: 'receipt_003.pdf',
    status: 'approved',
    submittedBy: { id: '1', name: 'Sarah Ahmed' },
    approvedBy: { id: '2', name: 'Mike Manager' },
    project: 'Document Processing',
    billable: true,
    tags: ['courier', 'documents'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '5',
    orgId: 'demo-org',
    description: 'Software subscription renewal',
    amount: 99,
    currency: 'USD',
    category: 'Software',
    subcategory: 'Subscriptions',
    date: '2024-01-15',
    paymentMethod: 'card',
    vendor: 'SaaS Provider',
    status: 'draft',
    submittedBy: { id: '5', name: 'Ali Hassan' },
    billable: false,
    tags: ['software', 'subscription'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { exportExpenses, isExporting } = useExport();

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && ['draft', 'submitted'].includes(expense.status)) ||
                      (activeTab === 'approved' && expense.status === 'approved') ||
                      (activeTab === 'reimbursed' && expense.status === 'reimbursed');
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'reimbursed': return 'bg-primary text-primary-foreground';
      case 'submitted': return 'bg-warning text-warning-foreground';
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transportation': return <Car className="w-4 h-4" />;
      case 'Meals': return <Utensils className="w-4 h-4" />;
      case 'Office': return <Briefcase className="w-4 h-4" />;
      case 'Travel': return <Plane className="w-4 h-4" />;
      case 'Fuel': return <Fuel className="w-4 h-4" />;
      case 'Accommodation': return <Home className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'BDT' ? '৳' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleViewExpense = (expense: Expense) => {
    setViewingExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleSaveEdit = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    ));
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  const handleStatusUpdate = (expenseId: string, newStatus: Expense['status']) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === expenseId 
        ? { 
            ...exp, 
            status: newStatus,
            ...(newStatus === 'approved' ? { approvedBy: { id: '2', name: 'Mike Manager' } } : {})
          }
        : exp
    ));
  };

  const ExpenseCreateModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Record a new business expense for tracking and reimbursement</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Brief description of the expense" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input type="number" id="amount" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="BDT">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BDT">৳ Bangladeshi Taka</SelectItem>
                    <SelectItem value="USD">$ US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Meals">Meals & Entertainment</SelectItem>
                    <SelectItem value="Office">Office Supplies</SelectItem>
                    <SelectItem value="Travel">Travel & Accommodation</SelectItem>
                    <SelectItem value="Software">Software & Tools</SelectItem>
                    <SelectItem value="Shipping">Shipping & Courier</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="How was this paid?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Merchant</Label>
              <Input id="vendor" placeholder="Who was this paid to?" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Associate with project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-onboarding">Client Onboarding</SelectItem>
                  <SelectItem value="document-processing">Document Processing</SelectItem>
                  <SelectItem value="embassy-liaison">Embassy Liaison</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" placeholder="e.g. client, meeting, urgent" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any additional details..." rows={4} />
            </div>
            
            <div className="space-y-2">
              <Label>Receipt Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Click to upload receipt</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="billable" defaultChecked />
              <Label htmlFor="billable">Billable to client</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          <Button>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const totalExpenses = filteredExpenses.reduce((sum, expense) => {
    const amount = expense.currency === 'USD' ? expense.amount * 110 : expense.amount; // Convert USD to BDT for summary
    return sum + amount;
  }, 0);

  const approvedExpenses = filteredExpenses.filter(exp => exp.status === 'approved').reduce((sum, expense) => {
    const amount = expense.currency === 'USD' ? expense.amount * 110 : expense.amount;
    return sum + amount;
  }, 0);

  const pendingExpenses = filteredExpenses.filter(exp => ['draft', 'submitted'].includes(exp.status)).reduce((sum, expense) => {
    const amount = expense.currency === 'USD' ? expense.amount * 110 : expense.amount;
    return sum + amount;
  }, 0);

  const reimbursedExpenses = filteredExpenses.filter(exp => exp.status === 'reimbursed').reduce((sum, expense) => {
    const amount = expense.currency === 'USD' ? expense.amount * 110 : expense.amount;
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expense Management</h1>
          <p className="text-muted-foreground">Track business expenses and manage reimbursements</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            data={filteredExpenses.map(expense => ({
              'Date': expense.date,
              'Description': expense.description,
              'Category': expense.category,
              'Vendor': expense.vendor,
              'Amount': formatCurrency(expense.amount, expense.currency),
              'Status': expense.status,
              'Submitted By': expense.submittedBy.name
            }))}
            filename="expenses"
            title="Expenses Report"
            headers={['Date', 'Description', 'Category', 'Vendor', 'Amount', 'Status', 'Submitted By']}
          />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <FileText className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">৳{pendingExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredExpenses.filter(exp => ['draft', 'submitted'].includes(exp.status)).length} expenses
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <BarChart3 className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">৳{approvedExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready for reimbursement</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reimbursed</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">৳{reimbursedExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Meals">Meals & Entertainment</SelectItem>
            <SelectItem value="Office">Office Supplies</SelectItem>
            <SelectItem value="Travel">Travel & Accommodation</SelectItem>
            <SelectItem value="Software">Software & Tools</SelectItem>
            <SelectItem value="Shipping">Shipping & Courier</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="reimbursed">Reimbursed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expense Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="reimbursed">Reimbursed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          {expense.project && (
                            <div className="text-xs text-muted-foreground">Project: {expense.project}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          <span>{expense.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(expense.amount, expense.currency)}
                        {expense.billable && (
                          <Badge variant="outline" className="ml-2 text-xs">Billable</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {expense.submittedBy.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{expense.submittedBy.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                       <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="View Details" 
                              onClick={() => handleViewExpense(expense)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Edit" 
                              onClick={() => handleEditExpense(expense)}
                              disabled={isExporting}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {expense.receipt && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="View Receipt" 
                                onClick={() => window.open(`/receipts/${expense.receipt}`, '_blank')}
                              >
                                <Receipt className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ExpenseCreateModal />
      <ExpenseEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        expense={editingExpense}
        onSave={handleSaveEdit}
      />
      <ExpenseViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        expense={viewingExpense}
      />
    </div>
  );
};

export default ExpensesPage;