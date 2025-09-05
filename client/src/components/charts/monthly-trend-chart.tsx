import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp } from "lucide-react";
import type { Transaction } from "@shared/schema";
import { useMemo } from "react";

interface MonthlyTrendChartProps {
  data: Transaction[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
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
          net: 0,
        });
      }
      
      const monthData = monthlyData.get(monthKey);
      const amount = parseFloat(transaction.amount);
      
      if (transaction.type === 'income') {
        monthData.income += amount;
      } else {
        monthData.expenses += amount;
      }
      
      monthData.net = monthData.income - monthData.expenses;
    });

    return Array.from(monthlyData.values()).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <EmptyState
          icon={TrendingUp}
          title="No trend data available"
          description="Add transactions over multiple months to see trends"
        />
      </div>
    );
  }

  return (
    <div className="h-64" data-testid="monthly-trend-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={3}
            name="Income"
            dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={3}
            name="Expenses"
            dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            strokeDasharray="5 5"
            name="Net Income"
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
