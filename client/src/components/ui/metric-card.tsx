import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  trend?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-primary",
  description,
  trend 
}: MetricCardProps) {
  return (
    <Card className="metric-card glass-card border-border" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className={`text-2xl font-bold ${iconColor}`} data-testid={`value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
          </div>
          <div className={`bg-${iconColor.split('-')[1]}/10 p-3 rounded-lg`}>
            <Icon className={`${iconColor} h-6 w-6`} />
          </div>
        </div>
        {(description || trend) && (
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">
              {description || trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
