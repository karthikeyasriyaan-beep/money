import { MetricCard } from "@/components/ui/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { useTransactions, useSavingsAccounts, useSubscriptions } from "@/hooks/use-financial-data";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Plus,
  History
} from "lucide-react";
import { Link } from "wouter";
import { useMemo } from "react";

export default function Dashboard() {
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: savings = [], isLoading: savingsLoading } = useSavingsAccounts();
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useSubscriptions();

  const metrics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalSavings = savings.reduce((sum, s) => sum + parseFloat(s.balance), 0);
    const totalBalance = monthlyIncome - monthlyExpenses;

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      totalSavings
    };
  }, [transactions, savings]);

  const recentTransactions = transactions.slice(0, 5);

  if (transactionsLoading || savingsLoading || subscriptionsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-card rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-3xl font-bold text-foreground">Financial Dashboard</h2>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your financial overview.</p>
        </div>
        <Link href="/money">
          <Button className="btn-ripple bg-primary text-primary-foreground" data-testid="quick-add-btn">
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Balance"
          value={`$${metrics.totalBalance.toFixed(2)}`}
          icon={Wallet}
          iconColor="text-secondary"
          description={transactions.length > 0 ? "Current month" : "No transactions yet"}
        />
        <MetricCard
          title="Monthly Income"
          value={`$${metrics.monthlyIncome.toFixed(2)}`}
          icon={TrendingUp}
          iconColor="text-secondary"
          description={metrics.monthlyIncome > 0 ? "This month" : "Add your first income"}
        />
        <MetricCard
          title="Monthly Expenses"
          value={`$${metrics.monthlyExpenses.toFixed(2)}`}
          icon={TrendingDown}
          iconColor="text-destructive"
          description={metrics.monthlyExpenses > 0 ? "This month" : "Track your spending"}
        />
        <MetricCard
          title="Total Savings"
          value={`$${metrics.totalSavings.toFixed(2)}`}
          icon={PiggyBank}
          iconColor="text-accent"
          description={savings.length > 0 ? `${savings.length} accounts` : "Start saving today"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={transactions} />
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={transactions} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
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
                        <TrendingUp className={`h-4 w-4 ${
                          transaction.type === 'income' ? 'text-secondary' : 'text-destructive'
                        }`} />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No recent activity"
              description="Your transactions will appear here"
              actionLabel="Add First Transaction"
              onAction={() => {}}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
