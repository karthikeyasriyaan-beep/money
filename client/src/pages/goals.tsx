import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { GoalForm } from "@/components/forms/goal-form";
import { useFinancialGoals, useDeleteFinancialGoal } from "@/hooks/use-financial-data";
import { 
  Target, 
  Plus, 
  Crosshair, 
  TrendingUp, 
  Percent,
  MoreVertical,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { FinancialGoal } from "@shared/schema";

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const { data: goals = [], isLoading } = useFinancialGoals();
  const deleteGoal = useDeleteFinancialGoal();
  const { toast } = useToast();

  const metrics = {
    activeGoals: goals.filter(goal => !goal.isCompleted).length,
    totalTarget: goals.reduce((sum, goal) => sum + parseFloat(goal.targetAmount), 0),
    goalsSaved: goals.reduce((sum, goal) => sum + parseFloat(goal.currentAmount), 0),
    averageProgress: goals.length > 0 
      ? goals.reduce((sum, goal) => {
          const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
          return sum + Math.min(100, progress);
        }, 0) / goals.length 
      : 0
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal.mutateAsync(id);
      toast({
        title: "Success",
        description: "Financial goal deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete financial goal",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-card rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <h2 className="text-3xl font-bold text-foreground">Financial Goals</h2>
          <p className="text-muted-foreground mt-2">Set, track, and achieve your financial objectives.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="btn-ripple bg-primary text-primary-foreground"
          data-testid="add-goal-btn"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Goals"
          value={metrics.activeGoals.toString()}
          icon={Target}
          iconColor="text-primary"
        />
        <MetricCard
          title="Total Target"
          value={`$${metrics.totalTarget.toFixed(2)}`}
          icon={Crosshair}
          iconColor="text-accent"
        />
        <MetricCard
          title="Saved So Far"
          value={`$${metrics.goalsSaved.toFixed(2)}`}
          icon={TrendingUp}
          iconColor="text-secondary"
        />
        <MetricCard
          title="Average Progress"
          value={`${metrics.averageProgress.toFixed(1)}%`}
          icon={Percent}
          iconColor="text-muted"
        />
      </div>

      {/* Goals Progress Rings */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="goals-progress-section">
          {goals.slice(0, 6).map((goal) => {
            const progress = Math.min(100, (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100);
            
            return (
              <Card key={goal.id} className="glass-card border-border text-center">
                <CardContent className="p-6">
                  <ProgressRing progress={progress} className="mx-auto mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{progress.toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Complete</p>
                    </div>
                  </ProgressRing>
                  <h3 className="font-semibold text-foreground mb-2">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${parseFloat(goal.currentAmount).toFixed(2)} / ${parseFloat(goal.targetAmount).toFixed(2)}
                  </p>
                  {goal.targetDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goals List */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Your Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length > 0 ? (
            <div className="space-y-4" data-testid="goals-list">
              {goals.map((goal) => {
                const progress = Math.min(100, (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100);
                
                return (
                  <div 
                    key={goal.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border"
                    data-testid={`goal-${goal.id}`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{goal.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            goal.isCompleted 
                              ? 'bg-secondary/10 text-secondary' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {goal.isCompleted ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                ${parseFloat(goal.currentAmount).toFixed(2)}
                              </span>
                              <span className="text-muted-foreground">
                                ${parseFloat(goal.targetAmount).toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-primary">{progress.toFixed(1)}%</p>
                            {goal.targetDate && (
                              <p className="text-xs text-muted-foreground flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(goal.targetDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" data-testid={`goal-menu-${goal.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(goal)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(goal.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="No financial goals set"
              description="Create your first goal to start tracking your progress"
              actionLabel="Set Your First Goal"
              onAction={() => setShowForm(true)}
            />
          )}
        </CardContent>
      </Card>

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm 
          goal={editingGoal}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
