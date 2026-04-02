import type { Transaction } from "@/shared/types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  CreditCard,
} from "lucide-react";
import { computeInsightMetrics } from "@/features/insights/lib/insightMetrics";

type Props = {
  transactions: Transaction[];
};

export const InsightsOverview = ({ transactions }: Props) => {
  const {
    topCategory,
    maxSpend,
    savingsRate,
    monthlyDeltaPercent,
    latestMonth,
    previousMonth,
    avgExpense,
    totalIncome,
    totalExpense,
    netBalance,
    latestTransactionDate,
    incomeCount,
    expenseCount,
    transactionCount,
  } = computeInsightMetrics(transactions);

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <div className="grid gap-4 md:h-[calc(100vh-15rem)] md:grid-cols-2 md:auto-rows-fr xl:grid-cols-4">
      <Card className="h-full border-l-4 border-l-orange-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingDown className="size-4 mr-2 text-orange-500" /> Top Expense
            Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCategory}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total: ${formatCurrency(maxSpend)}
          </p>
        </CardContent>
      </Card>

      <Card className="h-full border-l-4 border-l-blue-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingUp className="size-4 mr-2 text-blue-500" /> Savings Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {savingsRate > 20
              ? "Great job on savings!"
              : "Consider reducing expenses."}
          </p>
        </CardContent>
      </Card>

      <Card className="h-full border-l-4 border-l-emerald-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingUp className="size-4 mr-2 text-emerald-500" /> Monthly
            Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyDeltaPercent >= 0 ? "+" : ""}
            {monthlyDeltaPercent.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {latestMonth && previousMonth
              ? `${latestMonth} vs ${previousMonth}`
              : "Not enough monthly data yet"}
          </p>
        </CardContent>
      </Card>

      <Card className="h-full border-l-4 border-l-indigo-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <Activity className="size-4 mr-2 text-indigo-500" /> Avg Transaction
            Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatCurrency(avgExpense)}
          </div>
          <p className="text-xs mt-1 text-indigo-500">Per recorded expense</p>
        </CardContent>
      </Card>

      <Card className="h-full border-l-4 border-l-teal-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingUp className="size-4 mr-2 text-teal-500" /> Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            ${formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {incomeCount} income records
          </p>
        </CardContent>
      </Card>

      <Card className="h-full border-l-4 border-l-rose-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingDown className="size-4 mr-2 text-rose-500" /> Total
            Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            ${formatCurrency(totalExpense)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {expenseCount} expense records
          </p>
        </CardContent>
      </Card>

      <Card className="h-full border-l-4 border-l-cyan-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <CreditCard className="size-4 mr-2 text-cyan-500" /> Net Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {netBalance >= 0 ? "+" : "-"}${formatCurrency(Math.abs(netBalance))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Income minus expenses
          </p>
        </CardContent>
      </Card>

      <Card className="h-full border-l-4 border-l-violet-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <Calendar className="size-4 mr-2 text-violet-500" /> Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {transactionCount} transactions
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Latest: {latestTransactionDate}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
