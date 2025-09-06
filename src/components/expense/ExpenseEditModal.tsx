import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense } from '@/types/expense';

interface ExpenseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSave: (expense: Expense) => void;
}

export const ExpenseEditModal: React.FC<ExpenseEditModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSave
}) => {
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (expense) {
      setEditedExpense({ ...expense });
    }
  }, [expense]);

  if (!editedExpense) return null;

  const handleSave = () => {
    onSave(editedExpense);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Modify expense details and update status</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Input 
                id="editDescription"
                value={editedExpense.description}
                onChange={(e) => setEditedExpense({...editedExpense, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editAmount">Amount</Label>
                <Input 
                  type="number"
                  id="editAmount"
                  value={editedExpense.amount}
                  onChange={(e) => setEditedExpense({...editedExpense, amount: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCurrency">Currency</Label>
                <Select 
                  value={editedExpense.currency}
                  onValueChange={(value: 'BDT' | 'USD') => setEditedExpense({...editedExpense, currency: value})}
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editCategory">Category</Label>
              <Select 
                value={editedExpense.category}
                onValueChange={(value) => setEditedExpense({...editedExpense, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="editVendor">Vendor</Label>
              <Input 
                id="editVendor"
                value={editedExpense.vendor}
                onChange={(e) => setEditedExpense({...editedExpense, vendor: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editDate">Date</Label>
              <Input 
                type="date"
                id="editDate"
                value={editedExpense.date}
                onChange={(e) => setEditedExpense({...editedExpense, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select 
                value={editedExpense.status}
                onValueChange={(value: Expense['status']) => setEditedExpense({...editedExpense, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="reimbursed">Reimbursed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editPaymentMethod">Payment Method</Label>
              <Select 
                value={editedExpense.paymentMethod}
                onValueChange={(value: Expense['paymentMethod']) => setEditedExpense({...editedExpense, paymentMethod: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="editBillable" 
                checked={editedExpense.billable}
                onChange={(e) => setEditedExpense({...editedExpense, billable: e.target.checked})}
              />
              <Label htmlFor="editBillable">Billable to client</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};