"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/components/icons";
import type { Transaction } from "@/lib/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>
          A log of your recent income and expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 5).map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                         <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground hidden md:inline">
                          {transaction.category}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
