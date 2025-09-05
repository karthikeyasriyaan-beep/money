import { Menu } from "lucide-react";
import { useLocation } from "wouter";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const pageNames = {
  "/": "Dashboard",
  "/subscriptions": "Subscriptions",
  "/money": "Money Manager",
  "/savings": "Savings",
  "/goals": "Goals",
  "/analytics": "Analytics",
};

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const [location] = useLocation();
  const pageName = pageNames[location as keyof typeof pageNames] || "Dashboard";

  return (
    <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
      <button 
        onClick={onMenuClick}
        className="text-foreground"
        data-testid="menu-toggle"
      >
        <Menu className="h-6 w-6" />
      </button>
      <h2 className="text-lg font-semibold">{pageName}</h2>
      <div></div>
    </div>
  );
}
