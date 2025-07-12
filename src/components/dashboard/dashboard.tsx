// src/components/dashboard/dashboard.tsx
'use client';

import React, {useMemo} from 'react';
import Header from '@/components/dashboard/header';
import OverviewCards from '@/components/dashboard/overview-cards';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SpendingChart from '@/components/dashboard/spending-chart';
import BudgetGoals from '@/components/dashboard/budget-goals';
import SmartBudgetingToolDialog from '@/components/dashboard/smart-budgeting-tool-dialog';
import type {Transaction, BudgetGoal, SpendingByCategory} from '@/lib/types';
import {Card, CardContent} from '@/components/ui/card';
import {useAuth} from '../auth/auth-provider';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {collection, doc} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {Skeleton} from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const {user, loading: authLoading} = useAuth();

  const transactionsRef = user ? collection(db, `users/${user.uid}/transactions`) : null;
  const budgetGoalsRef = user ? collection(db, `users/${user.uid}/budgetGoals`) : null;

  const [transactions = [], transactionsLoading] = useCollectionData<Transaction>(transactionsRef, {
    idField: 'id',
  });

  const [budgetGoals = [], budgetGoalsLoading] = useCollectionData<BudgetGoal>(budgetGoalsRef, {
    idField: 'id',
  });

  const loading = authLoading || transactionsLoading || budgetGoalsLoading;

  const {totalIncome, totalExpenses, balance, spendingByCategory} = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const spending: SpendingByCategory = {};

    transactions.forEach(t => {
      // Firestore may return Timestamps, so we convert them to Dates
      const transactionDate = t.date instanceof Date ? t.date : (t.date as any).toDate();
      const transaction = {...t, date: transactionDate};

      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
        spending[transaction.category] = (spending[transaction.category] || 0) + transaction.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      spendingByCategory: spending,
    };
  }, [transactions]);

  const aiToolInput = useMemo(
    () => ({
      income: totalIncome,
      expenses: transactions
        .filter(t => t.type === 'expense')
        .map(({category, amount}) => ({category, amount})),
      budgetGoals: budgetGoals,
    }),
    [totalIncome, transactions, budgetGoals]
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-8">
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-80" />
              <Skeleton className="h-64" />
              <Skeleton className="h-20" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-8">
            <OverviewCards income={totalIncome} expenses={totalExpenses} balance={balance} />
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
