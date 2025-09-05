import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { SubscriptionForm } from "@/components/forms/subscription-form";
import { useSubscriptions, useDeleteSubscription } from "@/hooks/use-financial-data";
import { 
  RotateCcw, 
  Plus, 
  List, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Subscription } from "@shared/schema";

export default function Subscriptions() {
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const deleteSubscription = useDeleteSubscription();
  const { toast } = useToast();

  const metrics = {
    monthlyTotal: subscriptions.reduce((sum, sub) => sum + parseFloat(sub.cost), 0),
    activeServices: subscriptions.filter(sub => sub.isActive).length,
    nextPayment: subscriptions.length > 0 
      ? new Date(Math.min(...subscriptions.map(sub => new Date(sub.nextPaymentDate).getTime())))
      : null
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription.mutateAsync(id);
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete subscription",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSubscription(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-card rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Subscriptions Manager</h2>
          <p className="text-muted-foreground mt-2">Track and manage all your recurring subscriptions.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="btn-ripple bg-primary text-primary-foreground"
          data-testid="add-subscription-btn"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Monthly Total"
          value={`$${metrics.monthlyTotal.toFixed(2)}`}
          icon={RotateCcw}
          iconColor="text-destructive"
        />
        <MetricCard
          title="Active Services"
          value={metrics.activeServices.toString()}
          icon={List}
          iconColor="text-accent"
        />
        <MetricCard
          title="Next Payment"
          value={metrics.nextPayment ? metrics.nextPayment.toLocaleDateString() : "--"}
          icon={Calendar}
          iconColor="text-secondary"
        />
      </div>

      {/* Subscriptions List */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length > 0 ? (
            <div className="space-y-4" data-testid="subscriptions-list">
              {subscriptions.map((subscription) => (
                <div 
                  key={subscription.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border"
                  data-testid={`subscription-${subscription.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <RotateCcw className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{subscription.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Next payment: {new Date(subscription.nextPaymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-destructive">
                        ${parseFloat(subscription.cost).toFixed(2)}/month
                      </p>
                      <p className={`text-sm ${subscription.isActive ? 'text-secondary' : 'text-muted-foreground'}`}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" data-testid={`subscription-menu-${subscription.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(subscription)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(subscription.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={RotateCcw}
              title="No subscriptions added yet"
              description="Add your first subscription to start tracking recurring payments"
              actionLabel="Add Your First Subscription"
              onAction={() => setShowForm(true)}
            />
          )}
        </CardContent>
      </Card>

      {/* Subscription Form Modal */}
      {showForm && (
        <SubscriptionForm 
          subscription={editingSubscription}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
