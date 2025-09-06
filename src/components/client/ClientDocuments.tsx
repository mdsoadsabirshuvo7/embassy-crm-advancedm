import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Download, 
  Eye, 
  Edit, 
  Trash,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Client, Document } from '@/types/database';
import { toast } from '@/hooks/use-toast';

interface ClientDocumentsProps {
  client: Client;
}

export const ClientDocuments: React.FC<ClientDocumentsProps> = ({ client }) => {
  const { documents, addDocument, updateDocument, deleteDocument } = useData();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const clientDocuments = documents.filter(doc => doc.clientId === client.id);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'other' as Document['category'],
    file: null as File | null
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ 
        ...prev, 
        file,
        name: file.name
      }));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would upload to a file storage service
    // For demo purposes, we'll create a mock URL
    const mockUrl = URL.createObjectURL(uploadForm.file);
    
    const documentData = {
      orgId: 'demo-org',
      name: uploadForm.name,
      type: getFileType(uploadForm.file.name),
      size: uploadForm.file.size,
      url: mockUrl,
      clientId: client.id,
      category: uploadForm.category,
      isTemplate: false,
      uploadedBy: 'current-user'
    };

    addDocument(documentData);
    setIsUploadModalOpen(false);
    setUploadForm({ name: '', category: 'other', file: null });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocument) {
      updateDocument(selectedDocument.id, {
        name: uploadForm.name,
        category: uploadForm.category
      });
      setIsEditModalOpen(false);
      setSelectedDocument(null);
    }
  };

  const getFileType = (fileName: string): Document['type'] => {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'docx':
      case 'doc': return 'docx';
      case 'jpg':
      case 'jpeg': return 'jpg';
      case 'png': return 'png';
      default: return 'pdf';
    }
  };

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'docx': return <File className="w-4 h-4 text-blue-500" />;
      case 'jpg':
      case 'png': return <Image className="w-4 h-4 text-green-500" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Document['category']) => {
    switch (category) {
      case 'passport': return 'bg-blue-100 text-blue-800';
      case 'visa': return 'bg-green-100 text-green-800';
      case 'certificate': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'invoice': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Documents</CardTitle>
              <CardDescription>
                Manage documents for {client.name}
              </CardDescription>
            </div>
            <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clientDocuments.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload First Document
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(document.type)}
                        <div>
                          <div className="font-medium">{document.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="uppercase">{document.type}</TableCell>
                    <TableCell>{formatFileSize(document.size)}</TableCell>
                    <TableCell>
                      {new Date(document.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedDocument(document);
                              setUploadForm({
                                name: document.name,
                                category: document.category,
                                file: null
                              });
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteDocument(document.id)}
                            className="text-destructive"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document for {client.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={uploadForm.category} 
                onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value as Document['category'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Upload Document
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Document Name</Label>
              <Input
                id="editName"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategory">Category</Label>
              <Select 
                value={uploadForm.category} 
                onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value as Document['category'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Document
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};