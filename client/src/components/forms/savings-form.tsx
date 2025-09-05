import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateSavingsAccount, useUpdateSavingsAccount } from "@/hooks/use-financial-data";
import { useToast } from "@/hooks/use-toast";
import type { SavingsAccount } from "@shared/schema";
import { X } from "lucide-react";

interface SavingsFormProps {
  account?: SavingsAccount | null;
  onClose: () => void;
}

export function SavingsForm({ account, onClose }: SavingsFormProps) {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    balance: account?.balance || "",
    targetAmount: account?.targetAmount || "",
    interestRate: account?.interestRate || "",
  });

  const createSavingsAccount = useCreateSavingsAccount();
  const updateSavingsAccount = useUpdateSavingsAccount();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        name: formData.name,
        balance: formData.balance || "0",
        targetAmount: formData.targetAmount || null,
        interestRate: formData.interestRate || "0",
      };

      if (account) {
        await updateSavingsAccount.mutateAsync({ id: account.id, data });
        toast({
          title: "Success",
          description: "Savings account updated successfully",
        });
      } else {
        await createSavingsAccount.mutateAsync(data);
        toast({
          title: "Success",
          description: "Savings account created successfully",
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save savings account",
        variant: "destructive",
      });
    }
  };

  const isLoading = createSavingsAccount.isPending || updateSavingsAccount.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="dialog-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {account ? "Edit Savings Account" : "Create Savings Account"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="form-close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund, Vacation Fund"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-account-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              data-testid="input-balance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (Optional)</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              data-testid="input-target-amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%) (Optional)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              data-testid="input-interest-rate"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="btn-ripple bg-primary text-primary-foreground flex-1"
              disabled={isLoading}
              data-testid="button-save-account"
            >
              {isLoading ? "Saving..." : account ? "Update Account" : "Create Account"}
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
