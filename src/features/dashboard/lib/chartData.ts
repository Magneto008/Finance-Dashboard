import type { Transaction } from "@/shared/types/finance";

type BalancePoint = { date: string; balance: number };
type CategoryPoint = { name: string; value: number; fill: string };

export const buildBalanceData = (transactions: Transaction[]): BalancePoint[] => {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let runningBalance = 0;
  const dateMap: Record<string, number> = {};

  for (const transaction of sorted) {
    if (transaction.type === "income") {
      runningBalance += Number(transaction.amount);
    } else {
      runningBalance -= Number(transaction.amount);
    }

    dateMap[transaction.date] = runningBalance;
  }

  return Object.keys(dateMap).map((date) => ({
    date,
    balance: dateMap[date],
  }));
};

export const buildCategoryData = (
  transactions: Transaction[],
  colors: string[],
): CategoryPoint[] => {
  const categoryMap: Record<string, number> = {};

  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;
    categoryMap[transaction.category] =
      (categoryMap[transaction.category] || 0) + Number(transaction.amount);
  }

  return Object.keys(categoryMap)
    .map((name, index) => ({
      name,
      value: categoryMap[name],
      fill: colors[index % colors.length],
    }))
    .sort((a, b) => b.value - a.value);
};
