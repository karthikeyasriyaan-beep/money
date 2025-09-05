import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { useTransactions, useFinancialGoals } from "@/hooks/use-financial-data";
import { 
  TrendingUp, 
  PieChart, 
  Percent, 
  Target,
  Download,
  Lightbulb
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30");
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: goals = [], isLoading: goalsLoading } = useFinancialGoals();

  const hasData = transactions.length > 0 || goals.length > 0;

  if (transactionsLoading || goalsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-card rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-card rounded"></div>
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
          <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-2">Deep insights into your financial patterns and trends.</p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="btn-ripple bg-primary text-primary-foreground"
            disabled={!hasData}
            data-testid="export-report-btn"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend Chart */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <MonthlyTrendChart data={transactions} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <EmptyState
                  icon={TrendingUp}
                  title="No trend data available"
                  description="Add transactions over multiple months to see trends"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending by Category */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.filter(t => t.type === 'expense').length > 0 ? (
              <ExpensePieChart data={transactions} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <EmptyState
                  icon={PieChart}
                  title="No category data"
                  description="Start categorizing expenses to see spending patterns"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Rate Chart */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <EmptyState
                icon={Percent}
                title="No savings data"
                description="Track income and savings to see your savings rate"
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress Chart */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 5).map((goal) => {
                  const progress = Math.min(100, (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100);
                  
                  return (
                    <div key={goal.id} className="space-y-2" data-testid={`goal-progress-${goal.id}`}>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{goal.name}</span>
                        <span className="text-muted-foreground">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <EmptyState
                  icon={Target}
                  title="No goals data"
                  description="Create financial goals to track progress"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Insights */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="space-y-6">
              {/* Spending Analysis */}
              {transactions.length > 0 && (
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent/20 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Spending Pattern Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        You have {transactions.filter(t => t.type === 'expense').length} expense transactions recorded. 
                        Your most frequent expense category is{" "}
                        {(() => {
                          const categories = transactions
                            .filter(t => t.type === 'expense')
                            .reduce((acc, t) => {
                              acc[t.category] = (acc[t.category] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>);
                          const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
                          return topCategory ? topCategory[0] : 'None';
                        })()}
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Analysis */}
              {goals.length > 0 && (
                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary/20 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Goals Progress Report</h3>
                      <p className="text-sm text-muted-foreground">
                        You have {goals.length} financial goal{goals.length > 1 ? 's' : ''} set up. 
                        {goals.filter(g => g.isCompleted).length > 0 && (
                          <> {goals.filter(g => g.isCompleted).length} goal{goals.filter(g => g.isCompleted).length > 1 ? 's' : ''} completed. </>
                        )}
                        Keep up the great work!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Lightbulb}
              title="No insights available yet"
              description="Add more financial data to get personalized insights and recommendations"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
