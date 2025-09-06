import React, { useState, useEffect, useCallback } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Building2, 
  DollarSign, 
  CheckSquare,
  Calendar,
  Search,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MockDataService } from '@/services/mockDataService';
import { Client, Document, Task, Invoice } from '@/types/database';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'client' | 'document' | 'task' | 'invoice' | 'employee';
  icon: React.ElementType;
  url: string;
  badge?: string;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<{
    clients: Client[];
    documents: Document[];
    tasks: Task[];
    invoices: Invoice[];
  }>({ clients: [], documents: [], tasks: [], invoices: [] });
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    if (!MockDataService.isDemoUser()) return;
    
    try {
      const [clients, documents, tasks, invoices] = await Promise.all([
        MockDataService.getMockClients(),
        MockDataService.getMockDocuments(),
        MockDataService.getMockTasks(),
        MockDataService.getMockInvoices(),
      ]);
      
      setAllData({ clients, documents, tasks, invoices });
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  }, []);

  useEffect(() => {
    if (open && user) {
      loadData();
    }
  }, [open, user, loadData]);

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search clients
    allData.clients.forEach(client => {
      const matchScore = 
        (client.name.toLowerCase().includes(searchTerm) ? 3 : 0) +
        (client.email.toLowerCase().includes(searchTerm) ? 2 : 0) +
        (client.company?.toLowerCase().includes(searchTerm) ? 2 : 0) +
        (client.phone.includes(searchTerm) ? 1 : 0);

      if (matchScore > 0) {
        results.push({
          id: client.id,
          title: client.name,
          subtitle: client.email,
          type: 'client',
          icon: Users,
          url: `/clients?id=${client.id}`,
          badge: client.status
        });
      }
    });

    // Search documents
    allData.documents.forEach(doc => {
      if (doc.name.toLowerCase().includes(searchTerm) || 
          doc.category.toLowerCase().includes(searchTerm)) {
        results.push({
          id: doc.id,
          title: doc.name,
          subtitle: `${doc.category} • ${doc.type.toUpperCase()}`,
          type: 'document',
          icon: FileText,
          url: `/documents?id=${doc.id}`,
          badge: doc.category
        });
      }
    });

    // Search tasks
    allData.tasks.forEach(task => {
      if (task.title.toLowerCase().includes(searchTerm) || 
          task.description.toLowerCase().includes(searchTerm)) {
        results.push({
          id: task.id,
          title: task.title,
          subtitle: task.description.slice(0, 60) + '...',
          type: 'task',
          icon: CheckSquare,
          url: `/tasks?id=${task.id}`,
          badge: task.status
        });
      }
    });

    // Search invoices
    allData.invoices.forEach(invoice => {
      if (invoice.number.toLowerCase().includes(searchTerm)) {
        results.push({
          id: invoice.id,
          title: `Invoice ${invoice.number}`,
          subtitle: `$${invoice.total.toFixed(2)} • Due ${new Date(invoice.dueDate).toLocaleDateString()}`,
          type: 'invoice',
          icon: DollarSign,
          url: `/invoices?id=${invoice.id}`,
          badge: invoice.status
        });
      }
    });

    // Sort by relevance and type
    results.sort((a, b) => {
      const typeOrder = { client: 1, invoice: 2, task: 3, document: 4, employee: 5 };
      return typeOrder[a.type] - typeOrder[b.type];
    });

    setSearchResults(results.slice(0, 15)); // Limit to 15 results
    setIsLoading(false);
  }, [allData]);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(result.url);
    onOpenChange(false);
  }, [navigate, onOpenChange]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'client': return Users;
      case 'document': return FileText;
      case 'task': return CheckSquare;
      case 'invoice': return DollarSign;
      case 'employee': return Building2;
      default: return Search;
    }
  };

  const getBadgeVariant = (badge: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (badge) {
      case 'active': case 'paid': case 'completed': return 'default';
      case 'pending': case 'in-progress': return 'secondary';
      case 'overdue': case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search clients, documents, tasks, invoices..." 
        onValueChange={performSearch}
      />
      <CommandList>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
          </div>
        ) : (
          <>
            <CommandEmpty>
              <div className="text-center py-6">
                <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No results found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching for clients, documents, tasks, or invoices
                </p>
              </div>
            </CommandEmpty>
            
            {searchResults.length > 0 && (
              <>
                <CommandGroup heading="Recent Results">
                  {searchResults.map((result) => {
                    const IconComponent = getTypeIcon(result.type);
                    return (
                      <CommandItem
                        key={result.id}
                        value={`${result.title} ${result.subtitle}`}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center gap-3 p-3 cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent">
                          <IconComponent className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            {result.badge && (
                              <Badge variant={getBadgeVariant(result.badge)} className="text-xs">
                                {result.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {result.type}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                
                <div className="border-t p-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Press <kbd className="px-1 py-0.5 text-xs bg-accent rounded">↵</kbd> to open
                    • <kbd className="px-1 py-0.5 text-xs bg-accent rounded">Esc</kbd> to close
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};