"use client";

import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCategoryIcon } from "@/components/icons";
import type { BudgetGoal, SpendingByCategory } from "@/lib/types";
import { Target } from "lucide-react";

interface BudgetGoalsProps {
  goals: BudgetGoal[];
  spending: SpendingByCategory;
}

const BudgetGoals: FC<BudgetGoalsProps> = ({ goals, spending }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Target className="w-6 h-6" />
          Budget Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const spent = spending[goal.category] || 0;
            const progress = (spent / goal.goal) * 100;
            const Icon = getCategoryIcon(goal.category);

            return (
              <div key={goal.category}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{goal.category}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(spent)} / {formatCurrency(goal.goal)}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetGoals;
