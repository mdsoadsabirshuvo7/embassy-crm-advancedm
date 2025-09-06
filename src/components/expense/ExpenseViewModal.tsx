import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  CreditCard, 
  Building2, 
  Receipt, 
  User, 
  CheckCircle, 
  Tag,
  ExternalLink
} from 'lucide-react';
import { Expense } from '@/types/expense';

interface ExpenseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}

export const ExpenseViewModal: React.FC<ExpenseViewModalProps> = ({
  isOpen,
  onClose,
  expense
}) => {
  if (!expense) return null;

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'BDT' ? '৳' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Credit/Debit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cheque': return 'Cheque';
      default: return method;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Expense Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this expense record
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expense Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Description</h4>
                <p className="text-lg">{expense.description}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Amount</h4>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(expense.amount, expense.currency)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Status</h4>
                  <Badge className={getStatusColor(expense.status)}>
                    {expense.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date
                  </h4>
                  <p>{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    Payment Method
                  </h4>
                  <p>{getPaymentMethodLabel(expense.paymentMethod)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Vendor
                </h4>
                <p>{expense.vendor}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Category</h4>
                <p>{expense.category} • {expense.subcategory}</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Submitted By
                </h4>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {expense.submittedBy.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{expense.submittedBy.name}</span>
                </div>
              </div>
              
              {expense.approvedBy && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Approved By
                  </h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {expense.approvedBy.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{expense.approvedBy.name}</span>
                  </div>
                </div>
              )}
              
              {expense.project && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Project</h4>
                  <p>{expense.project}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Badge variant={expense.billable ? "default" : "secondary"}>
                  {expense.billable ? 'Billable' : 'Non-billable'}
                </Badge>
              </div>
              
              {expense.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {expense.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {expense.receipt && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Receipt</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(`/receipts/${expense.receipt}`, '_blank')}
                    className="mt-1"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Receipt
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};