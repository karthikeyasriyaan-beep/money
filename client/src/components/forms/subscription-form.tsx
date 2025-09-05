import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { useCreateSubscription, useUpdateSubscription } from "@/hooks/use-financial-data";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";
import type { Subscription } from "@shared/schema";
import { X } from "lucide-react";

interface SubscriptionFormProps {
  subscription?: Subscription | null;
  onClose: () => void;
}

export function SubscriptionForm({ subscription, onClose }: SubscriptionFormProps) {
  const { currency, setCurrency, getSymbol } = useCurrency();
  const [formData, setFormData] = useState({
    name: subscription?.name || "",
    cost: subscription?.cost || "",
    currency: currency,
    nextPaymentDate: subscription?.nextPaymentDate 
      ? new Date(subscription.nextPaymentDate).toISOString().split('T')[0]
      : "",
    isActive: subscription?.isActive ?? true,
  });

  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.cost || !formData.nextPaymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        name: formData.name,
        cost: formData.cost,
        nextPaymentDate: new Date(formData.nextPaymentDate),
        isActive: formData.isActive,
      };

      if (subscription) {
        await updateSubscription.mutateAsync({ id: subscription.id, data });
        toast({
          title: "Success",
          description: "Subscription updated successfully",
        });
      } else {
        await createSubscription.mutateAsync(data);
        toast({
          title: "Success",
          description: "Subscription created successfully",
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save subscription",
        variant: "destructive",
      });
    }
  };

  const isLoading = createSubscription.isPending || updateSubscription.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="dialog-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {subscription ? "Edit Subscription" : "Add Subscription"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="form-close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              placeholder="e.g., Netflix, Spotify"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-service-name"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="cost">Monthly Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                data-testid="input-monthly-cost"
              />
            </div>
            <CurrencySelector
              value={formData.currency}
              onChange={(value) => {
                setFormData({ ...formData, currency: value });
                setCurrency(value);
              }}
              className="space-y-2"
              label="Currency"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
            <Input
              id="nextPaymentDate"
              type="date"
              value={formData.nextPaymentDate}
              onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
              data-testid="input-next-payment"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="btn-ripple bg-primary text-primary-foreground flex-1"
              disabled={isLoading}
              data-testid="button-save-subscription"
            >
              {isLoading ? "Saving..." : subscription ? "Update Subscription" : "Add Subscription"}
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
