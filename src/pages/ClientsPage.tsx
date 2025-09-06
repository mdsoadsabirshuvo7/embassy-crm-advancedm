import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash,
  Phone,
  Mail,
  MapPin,
  Users,
  TrendingUp,
  Building
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { Client } from '@/types/database';
import { ClientForm } from '@/components/client/ClientForm';
import { ClientDocuments } from '@/components/client/ClientDocuments';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success text-success-foreground';
    case 'pending': return 'bg-warning text-warning-foreground';
    case 'inactive': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const ClientsPage: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, documents } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesTab = activeTab === 'all' || client.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleCreateClient = (clientData: Partial<Client>) => {
    addClient(clientData as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>);
    setIsCreateModalOpen(false);
  };

  const handleEditClient = (clientData: Partial<Client>) => {
    if (selectedClient) {
      updateClient(selectedClient.id, clientData);
      setIsEditModalOpen(false);
      setSelectedClient(null);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    deleteClient(clientId);
  };

  const ClientViewModal = () => {
    if (!selectedClient) return null;

    return (
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {selectedClient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl font-bold">{selectedClient.name}</div>
                    <Badge className={getStatusColor(selectedClient.status)}>
                      {selectedClient.status}
                    </Badge>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Client Details</TabsTrigger>
                  <TabsTrigger value="documents">Documents ({documents.filter(doc => doc.clientId === selectedClient.id).length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedClient.address}</span>
                      </div>
                      {selectedClient.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{selectedClient.company}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Nationality:</span>
                        <span className="text-sm ml-2">{selectedClient.nationality}</span>
                      </div>
                      {selectedClient.passportNumber && (
                        <div>
                          <span className="text-sm font-medium">Passport Number:</span>
                          <span className="text-sm ml-2">{selectedClient.passportNumber}</span>
                        </div>
                      )}
                      {selectedClient.visaType && (
                        <div>
                          <span className="text-sm font-medium">Visa Type:</span>
                          <span className="text-sm ml-2">{selectedClient.visaType}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium">Assigned To:</span>
                        <span className="text-sm ml-2">{selectedClient.assignedTo}</span>
                      </div>
                    </div>
                  </div>

                  {selectedClient.notes && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">{selectedClient.notes}</p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Total Billed:</span>
                        <span className="text-sm ml-2">৳{selectedClient.totalBilled.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Total Paid:</span>
                        <span className="text-sm ml-2">৳{selectedClient.totalPaid.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <ClientDocuments client={selectedClient} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
    );
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">
            Manage your clients and their information efficiently
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Client
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              </div>
              <Users className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            Search and filter through your client database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead>Total Billed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            No clients found matching your search criteria.
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {client.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                {client.company && (
                                  <div className="text-sm text-muted-foreground">{client.company}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{client.email}</div>
                              <div className="text-sm text-muted-foreground">{client.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{client.assignedTo}</TableCell>
                          <TableCell>{client.nationality}</TableCell>
                          <TableCell>৳{client.totalBilled.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedClient(client);
                                    setIsViewModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedClient(client);
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Client
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="text-destructive"
                                >
                                  <Trash className="w-4 h-4 mr-2" />
                                  Delete Client
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <ClientForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClient}
      />

      <ClientForm
        client={selectedClient || undefined}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={handleEditClient}
      />

      <ClientViewModal />
    </div>
  );
};