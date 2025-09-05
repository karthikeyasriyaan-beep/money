import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { FloatingShapes } from "@/components/floating-shapes";
import Dashboard from "@/pages/dashboard";
import Subscriptions from "@/pages/subscriptions";
import MoneyManager from "@/pages/money-manager";
import Savings from "@/pages/savings";
import Goals from "@/pages/goals";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/money" component={MoneyManager} />
      <Route path="/savings" component={Savings} />
      <Route path="/goals" component={Goals} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen relative">
          <FloatingShapes />
          <div className="flex h-screen relative z-10">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 overflow-auto">
              <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
              <Router />
            </div>
          </div>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
