import type { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Activity } from "lucide-react";

type Props = {
  transactions: Transaction[];
};

export const InsightsOverview = ({ transactions }: Props) => {
  const expenses = transactions.filter(t => t.type === "expense");
  const income = transactions.filter(t => t.type === "income");

  // Highest Spending Category
  const categoryMap: Record<string, number> = {};
  expenses.forEach(t => {
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

  // Monthly comparison: compare expense total in the latest month against the previous month.
  const monthlyExpenses: Record<string, number> = {};
  expenses.forEach((expenseTransaction) => {
    const monthKey = expenseTransaction.date.slice(0, 7); // YYYY-MM
    monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + Number(expenseTransaction.amount);
  });

  const sortedMonths = Object.keys(monthlyExpenses).sort((a, b) => a.localeCompare(b));
  const latestMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];
  const latestMonthExpense = latestMonth ? monthlyExpenses[latestMonth] : 0;
  const previousMonthExpense = previousMonth ? monthlyExpenses[previousMonth] : 0;
  const monthlyDeltaPercent = previousMonthExpense > 0
    ? ((latestMonthExpense - previousMonthExpense) / previousMonthExpense) * 100
    : 0;

  const avgExpense = expenses.length > 0 ? expenses.reduce((acc, t) => acc + Number(t.amount), 0) / expenses.length : 0;
  const totalIncome = income.reduce((acc, t) => acc + Number(t.amount), 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - expenses.reduce((acc, t) => acc + Number(t.amount), 0)) / totalIncome) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm border-l-4 border-l-orange-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingDown className="size-4 mr-2 text-orange-500" /> Top Expense Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCategory}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total: ${maxSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingUp className="size-4 mr-2 text-blue-500" /> Savings Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {savingsRate > 20 ? "Great job on savings!" : "Consider reducing expenses."}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-emerald-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <TrendingUp className="size-4 mr-2 text-emerald-500" /> Monthly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyDeltaPercent >= 0 ? "+" : ""}{monthlyDeltaPercent.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {latestMonth && previousMonth
              ? `${latestMonth} vs ${previousMonth}`
              : "Not enough monthly data yet"}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-indigo-500 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <Activity className="size-4 mr-2 text-indigo-500" /> Avg Transaction Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs mt-1 text-indigo-500">
            Per recorded expense
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

