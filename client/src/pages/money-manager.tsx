import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionForm } from "@/components/forms/transaction-form";
import { useTransactions, useDeleteTransaction } from "@/hooks/use-financial-data";
import { 
  Wallet, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  Tags,
  Receipt,
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
import type { Transaction } from "@shared/schema";
import { useMemo } from "react";

export default function MoneyManager() {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const { toast } = useToast();

  const metrics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netBalance };
  }, [transactions]);

  const categories = useMemo(() => {
    const categoryMap = new Map();
    transactions.forEach(t => {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, { count: 0, total: 0, type: t.type });
      }
      const cat = categoryMap.get(t.category);
      cat.count += 1;
      cat.total += parseFloat(t.amount);
    });
    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      ...data
    }));
  }, [transactions]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction.mutateAsync(id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormType(transaction.type as 'income' | 'expense');
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const openIncomeForm = () => {
    setFormType('income');
    setShowForm(true);
  };

  const openExpenseForm = () => {
    setFormType('expense');
    setShowForm(true);
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
          <h2 className="text-3xl font-bold text-foreground">Money Manager</h2>
          <p className="text-muted-foreground mt-2">Track your income and expenses with detailed categorization.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={openIncomeForm}
            className="btn-ripple bg-secondary text-secondary-foreground"
            data-testid="add-income-btn"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Income
          </Button>
          <Button 
            onClick={openExpenseForm}
            className="btn-ripple bg-destructive text-destructive-foreground"
            data-testid="add-expense-btn"
          >
            <Minus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card border-border border-l-4 border-l-secondary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Total Income</h3>
            <p className="text-3xl font-bold text-secondary" data-testid="total-income">
              ${metrics.totalIncome.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border border-l-4 border-l-destructive">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-destructive" data-testid="total-expenses">
              ${metrics.totalExpenses.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border border-l-4 border-l-accent">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Net Balance</h3>
            <p className={`text-3xl font-bold ${
              metrics.netBalance >= 0 ? 'text-secondary' : 'text-destructive'
            }`} data-testid="net-balance">
              ${metrics.netBalance.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Income - Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="space-y-3" data-testid="categories-list">
                {categories.map((category) => (
                  <div 
                    key={category.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-card/50"
                    data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        category.type === 'income' ? 'bg-secondary/10' : 'bg-destructive/10'
                      }`}>
                        <Tags className={`h-4 w-4 ${
                          category.type === 'income' ? 'text-secondary' : 'text-destructive'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.count} transactions</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      category.type === 'income' ? 'text-secondary' : 'text-destructive'
                    }`}>
                      ${category.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Tags}
                title="No categories created"
                description="Categories will appear as you add transactions"
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3" data-testid="transactions-list">
                {transactions.slice(0, 10).map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card/50"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-secondary/10' : 'bg-destructive/10'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-4 w-4 text-secondary" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-secondary' : 'text-destructive'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`transaction-menu-${transaction.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(transaction.id)}
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
                icon={Receipt}
                title="No transactions yet"
                description="Add your first income or expense to get started"
                actionLabel="Add Transaction"
                onAction={openIncomeForm}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm 
          type={formType}
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
