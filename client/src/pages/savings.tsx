import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { SavingsForm } from "@/components/forms/savings-form";
import { useSavingsAccounts, useDeleteSavingsAccount } from "@/hooks/use-financial-data";
import { 
  PiggyBank, 
  Plus, 
  Building2, 
  CalendarPlus, 
  Percent,
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
import type { SavingsAccount } from "@shared/schema";

export default function Savings() {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SavingsAccount | null>(null);
  const { data: savingsAccounts = [], isLoading } = useSavingsAccounts();
  const deleteSavingsAccount = useDeleteSavingsAccount();
  const { toast } = useToast();

  const metrics = {
    totalSaved: savingsAccounts.reduce((sum, account) => sum + parseFloat(account.balance), 0),
    activeAccounts: savingsAccounts.length,
    monthlySavings: 0, // This would be calculated based on transaction history
    interestEarned: savingsAccounts.reduce((sum, account) => {
      const rate = parseFloat(account.interestRate || '0');
      return sum + (parseFloat(account.balance) * rate / 100 / 12);
    }, 0)
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSavingsAccount.mutateAsync(id);
      toast({
        title: "Success",
        description: "Savings account deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete savings account",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (account: SavingsAccount) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAccount(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-card rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <h2 className="text-3xl font-bold text-foreground">Savings Management</h2>
          <p className="text-muted-foreground mt-2">Create and track your savings accounts and goals.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="btn-ripple bg-primary text-primary-foreground"
          data-testid="add-savings-btn"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Savings Account
        </Button>
      </div>

      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Saved"
          value={`$${metrics.totalSaved.toFixed(2)}`}
          icon={PiggyBank}
          iconColor="text-secondary"
        />
        <MetricCard
          title="Active Accounts"
          value={metrics.activeAccounts.toString()}
          icon={Building2}
          iconColor="text-accent"
        />
        <MetricCard
          title="Monthly Savings"
          value={`$${metrics.monthlySavings.toFixed(2)}`}
          icon={CalendarPlus}
          iconColor="text-primary"
        />
        <MetricCard
          title="Interest Earned"
          value={`$${metrics.interestEarned.toFixed(2)}`}
          icon={Percent}
          iconColor="text-muted"
          description="This month"
        />
      </div>

      {/* Savings Accounts */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Your Savings Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {savingsAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="savings-accounts-list">
              {savingsAccounts.map((account) => (
                <Card 
                  key={account.id}
                  className="glass-card border-border hover:shadow-lg transition-all duration-300"
                  data-testid={`savings-account-${account.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-secondary/10 p-3 rounded-lg">
                          <PiggyBank className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {account.interestRate ? `${parseFloat(account.interestRate).toFixed(2)}% APY` : 'No interest'}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`account-menu-${account.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(account)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(account.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="text-2xl font-bold text-secondary">
                          ${parseFloat(account.balance).toFixed(2)}
                        </p>
                      </div>
                      
                      {account.targetAmount && (
                        <div>
                          <p className="text-sm text-muted-foreground">Target Amount</p>
                          <p className="text-lg font-semibold text-foreground">
                            ${parseFloat(account.targetAmount).toFixed(2)}
                          </p>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div 
                              className="bg-secondary h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (parseFloat(account.balance) / parseFloat(account.targetAmount)) * 100)}%` 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {((parseFloat(account.balance) / parseFloat(account.targetAmount)) * 100).toFixed(1)}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PiggyBank}
              title="No savings accounts yet"
              description="Create your first savings account to start building your financial future"
              actionLabel="Create Your First Account"
              onAction={() => setShowForm(true)}
            />
          )}
        </CardContent>
      </Card>

      {/* Savings Form Modal */}
      {showForm && (
        <SavingsForm 
          account={editingAccount}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
