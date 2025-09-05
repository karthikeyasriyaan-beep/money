import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-12" data-testid="empty-state">
      <Icon className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
      <p className="text-muted-foreground text-lg mb-2">{title}</p>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="btn-ripple"
          data-testid="empty-state-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
