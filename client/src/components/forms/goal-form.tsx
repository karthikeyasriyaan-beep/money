import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateFinancialGoal, useUpdateFinancialGoal } from "@/hooks/use-financial-data";
import { useToast } from "@/hooks/use-toast";
import type { FinancialGoal } from "@shared/schema";
import { X } from "lucide-react";

interface GoalFormProps {
  goal?: FinancialGoal | null;
  onClose: () => void;
}

export function GoalForm({ goal, onClose }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: goal?.name || "",
    targetAmount: goal?.targetAmount || "",
    currentAmount: goal?.currentAmount || "0",
    targetDate: goal?.targetDate 
      ? new Date(goal.targetDate).toISOString().split('T')[0]
      : "",
    isCompleted: goal?.isCompleted || false,
  });

  const createGoal = useCreateFinancialGoal();
  const updateGoal = useUpdateFinancialGoal();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.targetAmount) {
      toast({
        title: "Error",
        description: "Please fill in the goal name and target amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        name: formData.name,
        targetAmount: formData.targetAmount,
        currentAmount: formData.currentAmount,
        targetDate: formData.targetDate ? new Date(formData.targetDate) : null,
        isCompleted: formData.isCompleted,
      };

      if (goal) {
        await updateGoal.mutateAsync({ id: goal.id, data });
        toast({
          title: "Success",
          description: "Financial goal updated successfully",
        });
      } else {
        await createGoal.mutateAsync(data);
        toast({
          title: "Success",
          description: "Financial goal created successfully",
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save financial goal",
        variant: "destructive",
      });
    }
  };

  const isLoading = createGoal.isPending || updateGoal.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="dialog-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {goal ? "Edit Financial Goal" : "Create Financial Goal"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="form-close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Down Payment, Vacation, New Car"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-goal-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
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
            <Label htmlFor="currentAmount">Current Amount</Label>
            <Input
              id="currentAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              data-testid="input-current-amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (Optional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              data-testid="input-target-date"
            />
          </div>

          {goal && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCompleted"
                checked={formData.isCompleted}
                onCheckedChange={(checked) => setFormData({ ...formData, isCompleted: !!checked })}
                data-testid="checkbox-completed"
              />
              <Label htmlFor="isCompleted">Mark as completed</Label>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="btn-ripple bg-primary text-primary-foreground flex-1"
              disabled={isLoading}
              data-testid="button-save-goal"
            >
              {isLoading ? "Saving..." : goal ? "Update Goal" : "Create Goal"}
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
