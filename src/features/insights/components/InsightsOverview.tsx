import type { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  CreditCard,
} from "lucide-react";

type Props = {
  transactions: Transaction[];
};

export const InsightsOverview = ({ transactions }: Props) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  const income = transactions.filter((t) => t.type === "income");

  const categoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });

  let topCategory = "N/A";
  let maxSpend = 0;
  for (const [cat, amt] of Object.entries(categoryMap)) {
    if (amt > maxSpend) {
      maxSpend = amt;
      topCategory = cat;
    }
  }

  const monthlyExpenses: Record<string, number> = {};
  expenses.forEach((expenseTransaction) => {
    const monthKey = expenseTransaction.date.slice(0, 7); // YYYY-MM
    monthlyExpenses[monthKey] =
      (monthlyExpenses[monthKey] || 0) + Number(expenseTransaction.amount);
  });

  const sortedMonths = Object.keys(monthlyExpenses).sort((a, b) =>
    a.localeCompare(b),
  );
  const latestMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];
  const latestMonthExpense = latestMonth ? monthlyExpenses[latestMonth] : 0;
  const previousMonthExpense = previousMonth
    ? monthlyExpenses[previousMonth]
    : 0;
  const monthlyDeltaPercent =
    previousMonthExpense > 0
      ? ((latestMonthExpense - previousMonthExpense) / previousMonthExpense) *
        100
      : 0;

  const avgExpense =
    expenses.length > 0
      ? expenses.reduce((acc, t) => acc + Number(t.amount), 0) / expenses.length
      : 0;
  const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalIncome = income.reduce((acc, t) => acc + Number(t.amount), 0);
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const netBalance = totalIncome - totalExpense;

  const latestTransactionDate =
    transactions.length > 0
      ? [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0].date
      : "N/A";

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
            {income.length} income records
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
            {expenses.length} expense records
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
            {transactions.length} transactions
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Latest: {latestTransactionDate}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
