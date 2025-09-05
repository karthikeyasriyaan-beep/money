import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";
import type { Transaction } from "@shared/schema";
import { useMemo } from "react";

interface IncomeExpenseChartProps {
  data: Transaction[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    // Group transactions by month
    const monthlyData = new Map();
    
    data.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: new Date(date.getFullYear(), date.getMonth()).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
          income: 0,
          expenses: 0,
        });
      }
      
      const monthData = monthlyData.get(monthKey);
      const amount = parseFloat(transaction.amount);
      
      if (transaction.type === 'income') {
        monthData.income += amount;
      } else {
        monthData.expenses += amount;
      }
    });

    return Array.from(monthlyData.values()).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <EmptyState
          icon={BarChart3}
          title="No financial data yet"
          description="Add income and expenses to see trends"
        />
      </div>
    );
  }

  return (
    <div className="h-64" data-testid="income-expense-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))"
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
          />
          <Bar 
            dataKey="income" 
            fill="hsl(var(--secondary))" 
            name="Income"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="expenses" 
            fill="hsl(var(--destructive))" 
            name="Expenses"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
