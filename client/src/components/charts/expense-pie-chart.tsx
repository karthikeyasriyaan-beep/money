import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { EmptyState } from "@/components/ui/empty-state";
import { PieChart as PieChartIcon } from "lucide-react";
import type { Transaction } from "@shared/schema";
import { useMemo } from "react";

interface ExpensePieChartProps {
  data: Transaction[];
}

const COLORS = [
  'hsl(217, 91%, 60%)', // primary
  'hsl(158, 64%, 52%)', // secondary  
  'hsl(43, 96%, 56%)',  // accent
  'hsl(0, 84%, 60%)',   // destructive
  'hsl(283, 67%, 68%)', // chart-5
  'hsl(215, 32%, 27%)', // muted
];

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  const chartData = useMemo(() => {
    const expenses = data.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) return [];

    // Group expenses by category
    const categoryTotals = new Map();
    
    expenses.forEach(transaction => {
      const category = transaction.category;
      const amount = parseFloat(transaction.amount);
      
      if (categoryTotals.has(category)) {
        categoryTotals.set(category, categoryTotals.get(category) + amount);
      } else {
        categoryTotals.set(category, amount);
      }
    });

    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: 0, // Will be calculated after sorting
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index, array) => {
        const total = array.reduce((sum, i) => sum + i.value, 0);
        return {
          ...item,
          percentage: ((item.value / total) * 100).toFixed(1),
        };
      });
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <EmptyState
          icon={PieChartIcon}
          title="No expenses tracked"
          description="Add expenses to see category breakdown"
        />
      </div>
    );
  }

  return (
    <div className="h-64" data-testid="expense-pie-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))"
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          />
          <Legend 
            wrapperStyle={{
              color: "hsl(var(--foreground))",
              fontSize: "12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
