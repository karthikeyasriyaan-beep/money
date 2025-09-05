import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/use-financial-data";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@shared/schema";
import { X } from "lucide-react";

interface TransactionFormProps {
  type: 'income' | 'expense';
  transaction?: Transaction | null;
  onClose: () => void;
}

const incomeCategories = [
  "Salary",
  "Freelance", 
  "Investment",
  "Business",
  "Rental",
  "Other"
];

const expenseCategories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Insurance",
  "Other"
];

export function TransactionForm({ type, transaction, onClose }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: transaction?.description || "",
    amount: transaction?.amount || "",
    category: transaction?.category || "",
    date: transaction?.date 
      ? new Date(transaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { toast } = useToast();

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        description: formData.description,
        amount: formData.amount,
        type,
        category: formData.category,
        date: new Date(formData.date),
      };

      if (transaction) {
        await updateTransaction.mutateAsync({ id: transaction.id, data });
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
      } else {
        await createTransaction.mutateAsync(data);
        toast({
          title: "Success",
          description: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      });
    }
  };

  const isLoading = createTransaction.isPending || updateTransaction.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glass-card border-border animate-slide-up">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {transaction ? `Edit ${type === 'income' ? 'Income' : 'Expense'}` : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="form-close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder={type === 'income' ? "e.g., Salary, Freelance" : "e.g., Groceries, Gas"}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              data-testid="input-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              data-testid="input-amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              data-testid="input-date"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className={`btn-ripple flex-1 ${
                type === 'income' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-destructive text-destructive-foreground'
              }`}
              disabled={isLoading}
              data-testid="button-save-transaction"
            >
              {isLoading ? "Saving..." : transaction ? `Update ${type === 'income' ? 'Income' : 'Expense'}` : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
