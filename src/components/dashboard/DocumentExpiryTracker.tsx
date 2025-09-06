import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';
import { MockDataService } from '@/services/mockDataService';
import { Document } from '@/types/database';

interface ExpiringDocument {
  id: string;
  name: string;
  clientName: string;
  category: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  status: 'critical' | 'warning' | 'normal' | 'expired';
}

export const DocumentExpiryTracker: React.FC = () => {
  const [expiringDocs, setExpiringDocs] = useState<ExpiringDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpiringDocuments = async () => {
      if (!MockDataService.isDemoUser()) return;
      
      try {
        const [documents, clients] = await Promise.all([
          MockDataService.getMockDocuments(),
          MockDataService.getMockClients()
        ]);

        // Create mock expiry dates for demonstration
        const mockExpiringDocs: ExpiringDocument[] = [
          {
            id: '1',
            name: 'Passport - Ahmed Hassan',
            clientName: 'Ahmed Hassan',
            category: 'passport',
            expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
            daysUntilExpiry: 5,
            status: 'critical'
          },
          {
            id: '2',
            name: 'Work Visa - Maria Santos',
            clientName: 'Maria Santos',
            category: 'visa',
            expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            daysUntilExpiry: 15,
            status: 'warning'
          },
          {
            id: '3',
            name: 'Certificate - John Doe',
            clientName: 'John Doe',
            category: 'certificate',
            expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
            daysUntilExpiry: 45,
            status: 'normal'
          },
          {
            id: '4',
            name: 'License - Sarah Smith',
            clientName: 'Sarah Smith',
            category: 'other',
            expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            daysUntilExpiry: -2,
            status: 'expired'
          }
        ];

        setExpiringDocs(mockExpiringDocs);
      } catch (error) {
        console.error('Error loading expiring documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpiringDocuments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning': return <Clock className="w-4 h-4 text-warning" />;
      case 'normal': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'expired': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'warning': return <Badge variant="outline" className="text-warning border-warning">Warning</Badge>;
      case 'normal': return <Badge variant="outline">Normal</Badge>;
      case 'expired': return <Badge variant="destructive">Expired</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDaysText = (days: number) => {
    if (days < 0) {
      return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
    } else if (days === 0) {
      return 'Expires today';
    } else {
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
  };

  const criticalCount = expiringDocs.filter(doc => doc.status === 'critical').length;
  const warningCount = expiringDocs.filter(doc => doc.status === 'warning').length;
  const expiredCount = expiringDocs.filter(doc => doc.status === 'expired').length;

  if (isLoading) {
    return (
      <Card className="border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Document Expiry Tracker
            </CardTitle>
            <CardDescription>
              Monitor document expiration dates and renewal requirements
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </Button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{expiredCount}</div>
            <div className="text-xs text-muted-foreground">Expired</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{warningCount}</div>
            <div className="text-xs text-muted-foreground">Warning</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {expiringDocs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
              {getStatusIcon(doc.status)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  {getStatusBadge(doc.status)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)} • {getDaysText(doc.daysUntilExpiry)}
                </p>
                
                {/* Progress bar for non-expired documents */}
                {doc.status !== 'expired' && (
                  <div className="mt-2">
                    <Progress 
                      value={Math.max(0, Math.min(100, (90 - doc.daysUntilExpiry) / 90 * 100))} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground text-right">
                {doc.expiryDate.toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {expiringDocs.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-success mb-3" />
              <p className="text-sm text-muted-foreground">All documents are up to date!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};