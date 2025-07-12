import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
};

export type Category = {
  name: string;
  icon: LucideIcon;
};

export type BudgetGoal = {
  category: string;
  goal: number;
};

export type SpendingByCategory = {
    [category: string]: number;
}
