import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ExportDropdown } from '@/components/export/ExportDropdown';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Search,
  Filter,
  FileImage,
  File,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  Star,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png' | 'txt';
  size: number;
  category: 'passport' | 'visa' | 'certificate' | 'contract' | 'invoice' | 'template' | 'other';
  clientId?: string;
  clientName?: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  isTemplate: boolean;
  createdAt: string;
  lastModified: string;
  tags: string[];
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Ahmed_Hassan_Passport.pdf',
    type: 'pdf',
    size: 2048576,
    category: 'passport',
    clientId: '1',
    clientName: 'Ahmed Hassan',
    uploadedBy: { id: '1', name: 'Sarah Ahmed' },
    status: 'approved',
    isTemplate: false,
    createdAt: '2024-01-15',
    lastModified: '2024-01-15',
    tags: ['passport', 'client-doc']
  },
  {
    id: '2',
    name: 'Visa_Application_Template.docx',
    type: 'docx',
    size: 524288,
    category: 'template',
    uploadedBy: { id: '2', name: 'Mike Manager' },
    status: 'approved',
    isTemplate: true,
    createdAt: '2024-01-10',
    lastModified: '2024-01-20',
    tags: ['template', 'visa']
  },
  {
    id: '3',
    name: 'Maria_Santos_Certificate.jpg',
    type: 'jpg',
    size: 1048576,
    category: 'certificate',
    clientId: '2',
    clientName: 'Maria Santos',
    uploadedBy: { id: '3', name: 'Fatima Rahman' },
    status: 'pending',
    isTemplate: false,
    createdAt: '2024-01-18',
    lastModified: '2024-01-18',
    tags: ['certificate', 'education']
  },
  {
    id: '4',
    name: 'Service_Contract_Template.pdf',
    type: 'pdf',
    size: 307200,
    category: 'contract',
    uploadedBy: { id: '2', name: 'Mike Manager' },
    status: 'approved',
    isTemplate: true,
    createdAt: '2024-01-12',
    lastModified: '2024-01-16',
    tags: ['template', 'contract', 'legal']
  },
  {
    id: '5',
    name: 'Invoice_INV-2024-001.pdf',
    type: 'pdf',
    size: 153600,
    category: 'invoice',
    clientId: '1',
    clientName: 'Ahmed Hassan',
    uploadedBy: { id: '4', name: 'Ali Hassan' },
    status: 'approved',
    isTemplate: false,
    createdAt: '2024-01-15',
    lastModified: '2024-01-15',
    tags: ['invoice', 'billing']
  }
];

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'templates' && doc.isTemplate) ||
                      (activeTab === 'client-docs' && !doc.isTemplate && doc.clientId) ||
                      (activeTab === 'pending' && doc.status === 'pending');
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'docx': return <File className="w-5 h-5 text-blue-500" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'jpg':
      case 'png': return <FileImage className="w-5 h-5 text-purple-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const UploadModal = () => (
    <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload a new document or template</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: PDF, DOCX, XLSX, JPG, PNG (Max: 10MB)
            </p>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ahmed Hassan</SelectItem>
                  <SelectItem value="2">Maria Santos</SelectItem>
                  <SelectItem value="3">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" placeholder="e.g. passport, urgent, processing" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional notes about this document..." rows={3} />
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="template" />
            <Label htmlFor="template">Mark as template</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
          <Button>Upload Document</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const DocumentCard: React.FC<{ document: Document }> = ({ document }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getFileIcon(document.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm truncate">{document.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(document.size)} • {document.type.toUpperCase()}
                </p>
              </div>
              
              <Badge className={getStatusColor(document.status)} variant="secondary">
                {getStatusIcon(document.status)}
                <span className="ml-1 capitalize text-xs">{document.status}</span>
              </Badge>
            </div>
            
            {document.clientName && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {document.clientName}
              </div>
            )}
            
            {document.isTemplate && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-current text-yellow-500" />
                Template
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-wrap gap-1">
                {document.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
                {document.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{document.tags.length - 2}</span>
                )}
              </div>
              
               <div className="flex gap-1">
                 <Button variant="ghost" size="sm" title="Preview" onClick={() => console.log('Preview document', document.id)}>
                   <Eye className="w-3 h-3" />
                 </Button>
                 <Button variant="ghost" size="sm" title="Download" onClick={() => console.log('Download document', document.id)}>
                   <Download className="w-3 h-3" />
                 </Button>
                 <Button variant="ghost" size="sm" title="Share" onClick={() => console.log('Share document', document.id)}>
                   <Share className="w-3 h-3" />
                 </Button>
               </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Uploaded by {document.uploadedBy.name} • {new Date(document.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);
  const templateCount = documents.filter(doc => doc.isTemplate).length;
  const pendingCount = documents.filter(doc => doc.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground">Organize client documents and templates with branding</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            data={documents.map(doc => ({
              'Name': doc.name,
              'Type': doc.type.toUpperCase(),
              'Size': `${(doc.size/1024/1024).toFixed(2)} MB`,
              'Category': doc.category,
              'Status': doc.status,
              'Client': doc.clientName || '-',
              'Uploaded By': doc.uploadedBy.name,
              'Created At': doc.createdAt
            }))}
            filename="documents"
            title="Documents Export"
            headers={['Name','Type','Size','Category','Status','Client','Uploaded By','Created At']}
          />
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{documents.length}</div>
            <p className="text-xs text-muted-foreground">{formatFileSize(totalSize)} total size</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Templates</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{templateCount}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            <Building className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round((totalSize / (1024 * 1024 * 1024)) * 100) / 100}GB
            </div>
            <Progress value={25} className="h-1 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">25% of 20GB plan</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documents..."
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
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="visa">Visa</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="invoice">Invoice</SelectItem>
            <SelectItem value="template">Template</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="client-docs">Client Documents</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or upload some documents
                  </p>
                  <Button onClick={() => setIsUploadModalOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UploadModal />
    </div>
  );
};

export default DocumentsPage;