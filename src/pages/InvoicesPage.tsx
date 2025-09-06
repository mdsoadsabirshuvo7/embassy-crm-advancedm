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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Send, 
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: 'BDT' | 'USD';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    clientName: 'Ahmed Hassan',
    clientEmail: 'ahmed.hassan@gmail.com',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 25000,
    currency: 'BDT',
    status: 'sent',
    items: [
      { description: 'Visa Processing Service', quantity: 1, rate: 25000, amount: 25000 }
    ]
  },
  {
    id: '2',
    number: 'INV-2024-002',
    clientName: 'Maria Santos',
    clientEmail: 'maria.santos@yahoo.com',
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    amount: 1800,
    currency: 'USD',
    status: 'paid',
    items: [
      { description: 'Document Verification', quantity: 1, rate: 1800, amount: 1800 }
    ]
  },
  {
    id: '3',
    number: 'INV-2024-003',
    clientName: 'John Smith',
    clientEmail: 'john.smith@hotmail.com',
    issueDate: '2024-01-05',
    dueDate: '2024-01-20',
    amount: 32000,
    currency: 'BDT',
    status: 'overdue',
    items: [
      { description: 'Embassy Letter Processing', quantity: 2, rate: 16000, amount: 32000 }
    ]
  },
  {
    id: '4',
    number: 'INV-2024-004',
    clientName: 'Sarah Ahmed',
    clientEmail: 'sarah.ahmed@gmail.com',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    amount: 15000,
    currency: 'BDT',
    status: 'draft',
    items: [
      { description: 'Consultation Service', quantity: 1, rate: 15000, amount: 15000 }
    ]
  }
];

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { exportInvoices, isExporting } = useExport();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unpaid' && ['sent', 'overdue'].includes(invoice.status)) ||
                      (activeTab === 'paid' && invoice.status === 'paid') ||
                      (activeTab === 'draft' && invoice.status === 'draft');
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success text-success-foreground';
      case 'sent': return 'bg-primary text-primary-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'cancelled': return <Trash2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'BDT' ? '৳' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleDownloadInvoice = async (invoice: Invoice, format: 'pdf' | 'excel' | 'csv' = 'pdf') => {
    const invoiceData = [{
      'Invoice Number': invoice.number,
      'Client': invoice.clientName,
      'Issue Date': invoice.issueDate,
      'Due Date': invoice.dueDate,
      'Amount': formatCurrency(invoice.amount, invoice.currency),
      'Status': invoice.status
    }];

    await exportInvoices(invoiceData, format);
  };

  const handleBulkExport = async (format: 'pdf' | 'excel' | 'csv') => {
    await exportInvoices(filteredInvoices, format);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === updatedInvoice.id ? updatedInvoice : inv
    ));
    setIsEditModalOpen(false);
    setEditingInvoice(null);
  };

  const InvoiceCreateModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>Create a new invoice for your client</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ahmed">Ahmed Hassan</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="john">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input type="date" id="issueDate" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input type="date" id="dueDate" />
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
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invoice Items</Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                  <span>Description</span>
                  <span>Qty</span>
                  <span>Rate</span>
                  <span>Amount</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input placeholder="Service description" />
                  <Input type="number" placeholder="1" />
                  <Input type="number" placeholder="0.00" />
                  <div className="flex items-center font-mono">৳0.00</div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional notes..." rows={3} />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          <Button>Create Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const InvoiceEditModal = () => {
    if (!editingInvoice) return null;

    return (
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Edit invoice details for {editingInvoice.clientName}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editClientName">Client Name</Label>
                <Input 
                  id="editClientName" 
                  defaultValue={editingInvoice.clientName}
                  onChange={(e) => setEditingInvoice({...editingInvoice, clientName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editClientEmail">Client Email</Label>
                <Input 
                  id="editClientEmail" 
                  type="email"
                  defaultValue={editingInvoice.clientEmail}
                  onChange={(e) => setEditingInvoice({...editingInvoice, clientEmail: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editIssueDate">Issue Date</Label>
                <Input 
                  type="date" 
                  id="editIssueDate" 
                  defaultValue={editingInvoice.issueDate}
                  onChange={(e) => setEditingInvoice({...editingInvoice, issueDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDueDate">Due Date</Label>
                <Input 
                  type="date" 
                  id="editDueDate" 
                  defaultValue={editingInvoice.dueDate}
                  onChange={(e) => setEditingInvoice({...editingInvoice, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editAmount">Amount</Label>
                <Input 
                  type="number" 
                  id="editAmount" 
                  defaultValue={editingInvoice.amount}
                  onChange={(e) => setEditingInvoice({...editingInvoice, amount: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCurrency">Currency</Label>
                <Select 
                  defaultValue={editingInvoice.currency}
                  onValueChange={(value: 'BDT' | 'USD') => setEditingInvoice({...editingInvoice, currency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BDT">৳ Bangladeshi Taka</SelectItem>
                    <SelectItem value="USD">$ US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select 
                  defaultValue={editingInvoice.status}
                  onValueChange={(value: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled') => 
                    setEditingInvoice({...editingInvoice, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={() => handleSaveEdit(editingInvoice)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Create, manage, and track your client invoices</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            data={filteredInvoices.map(invoice => ({
              'Invoice Number': invoice.number,
              'Client': invoice.clientName,
              'Issue Date': invoice.issueDate,
              'Due Date': invoice.dueDate,
              'Amount': formatCurrency(invoice.amount, invoice.currency),
              'Status': invoice.status
            }))}
            filename="invoices"
            title="Invoices Report"
            headers={['Invoice Number', 'Client', 'Issue Date', 'Due Date', 'Amount', 'Status']}
          />
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
            <Receipt className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            <CheckCircle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">৳{paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.status === 'paid').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">৳{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).length} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {filteredInvoices.filter(inv => inv.status === 'overdue').length}
            </div>
            <p className="text-xs text-destructive">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>
                {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.clientName}</div>
                          <div className="text-xs text-muted-foreground">{invoice.clientEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status}</span>
                        </Badge>
                      </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" title="View" onClick={() => console.log('View invoice', invoice.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Edit" 
                              onClick={() => handleEditInvoice(invoice)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Download" 
                              onClick={() => handleDownloadInvoice(invoice)}
                              disabled={isExporting}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {invoice.status === 'draft' && (
                              <Button variant="ghost" size="sm" title="Send" onClick={() => console.log('Send invoice', invoice.id)}>
                                <Send className="w-4 h-4" />
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

      <InvoiceCreateModal />
      <InvoiceEditModal />
    </div>
  );
};

export default InvoicesPage;