import type { Transaction } from "@/shared/types/finance";

type InsightMetrics = {
  topCategory: string;
  maxSpend: number;
  savingsRate: number;
  monthlyDeltaPercent: number;
  latestMonth?: string;
  previousMonth?: string;
  avgExpense: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  latestTransactionDate: string;
  incomeCount: number;
  expenseCount: number;
  transactionCount: number;
};

export const computeInsightMetrics = (
  transactions: Transaction[],
): InsightMetrics => {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense",
  );
  const income = transactions.filter(
    (transaction) => transaction.type === "income",
  );

  const categoryMap: Record<string, number> = {};
  for (const expense of expenses) {
    categoryMap[expense.category] =
      (categoryMap[expense.category] || 0) + Number(expense.amount);
  }

  let topCategory = "N/A";
  let maxSpend = 0;
  for (const [category, amount] of Object.entries(categoryMap)) {
    if (amount > maxSpend) {
      maxSpend = amount;
      topCategory = category;
    }
  }

  const monthlyExpenses: Record<string, number> = {};
  for (const expense of expenses) {
    const monthKey = expense.date.slice(0, 7);
    monthlyExpenses[monthKey] =
      (monthlyExpenses[monthKey] || 0) + Number(expense.amount);
  }

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
      ? expenses.reduce((acc, tx) => acc + Number(tx.amount), 0) /
        expenses.length
      : 0;

  const totalExpense = expenses.reduce((acc, tx) => acc + Number(tx.amount), 0);
  const totalIncome = income.reduce((acc, tx) => acc + Number(tx.amount), 0);
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const netBalance = totalIncome - totalExpense;

  const latestTransactionDate =
    transactions.length > 0
      ? [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0].date
      : "N/A";

  return {
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
    incomeCount: income.length,
    expenseCount: expenses.length,
    transactionCount: transactions.length,
  };
};
