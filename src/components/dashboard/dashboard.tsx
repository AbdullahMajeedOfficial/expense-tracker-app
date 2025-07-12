"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/dashboard/header";
import OverviewCards from "@/components/dashboard/overview-cards";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import SpendingChart from "@/components/dashboard/spending-chart";
import BudgetGoals from "@/components/dashboard/budget-goals";
import SmartBudgetingToolDialog from "@/components/dashboard/smart-budgeting-tool-dialog";
import type { Transaction, BudgetGoal, SpendingByCategory } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

const mockTransactions: Transaction[] = [
  { id: "1", date: new Date("2024-07-15"), description: "Salary", amount: 5000, category: "Salary", type: "income" },
  { id: "2", date: new Date("2024-07-20"), description: "Groceries", amount: 150.75, category: "Food", type: "expense" },
  { id: "3", date: new Date("2024-07-21"), description: "Gas Bill", amount: 75.20, category: "Utilities", type: "expense" },
  { id: "4", date: new Date("2024-07-22"), description: "Dinner with friends", amount: 80.00, category: "Entertainment", type: "expense" },
  { id: "5", date: new Date("2024-07-23"), description: "New shoes", amount: 120.00, category: "Shopping", type: "expense" },
  { id: "6", date: new Date("2024-07-25"), description: "Freelance Project", amount: 750, category: "Investments", type: "income" },
  { id: "7", date: new Date("2024-07-26"), description: "Monthly rent", amount: 1200, category: "Rent", type: "expense" },
  { id: "8", date: new Date("2024-07-28"), description: "Public transport", amount: 50, category: "Transport", type: "expense" },
];

const mockBudgetGoals: BudgetGoal[] = [
  { category: "Food", goal: 400 },
  { category: "Entertainment", goal: 150 },
  { category: "Shopping", goal: 200 },
  { category: "Transport", goal: 100 },
];

const Dashboard: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [budgetGoals] = useState<BudgetGoal[]>(mockBudgetGoals);

  const { totalIncome, totalExpenses, balance, spendingByCategory } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const spending: SpendingByCategory = {};

    transactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expenses += t.amount;
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      spendingByCategory: spending,
    };
  }, [transactions]);
  
  const aiToolInput = useMemo(() => ({
    income: totalIncome,
    expenses: transactions
      .filter(t => t.type === 'expense')
      .map(({ category, amount }) => ({ category, amount })),
    budgetGoals: budgetGoals,
  }), [totalIncome, transactions, budgetGoals]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-8">
            <OverviewCards
              income={totalIncome}
              expenses={totalExpenses}
              balance={balance}
            />
            <RecentTransactions transactions={transactions} />
          </div>
          <div className="space-y-8">
            <SpendingChart data={spendingByCategory} />
            <BudgetGoals goals={budgetGoals} spending={spendingByCategory} />
            <Card>
              <CardContent className="p-6">
                 <SmartBudgetingToolDialog {...aiToolInput} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
