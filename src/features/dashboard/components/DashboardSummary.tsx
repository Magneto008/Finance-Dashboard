import type { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

type Props = {
  transactions: Transaction[];
};

export const DashboardSummary = ({ transactions }: Props) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-primary/20 transition-transform hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <div className="bg-primary/20 p-2 rounded-full">
            <Wallet className="size-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs mt-1 text-primary">+20.1% from last month</p>
        </CardContent>
      </Card>

      <Card className="border-green-500/20 transition-transform hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <div className="bg-green-500/20 p-2 rounded-full">
            <ArrowUpRight className="size-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs mt-1 text-green-600/70">
            +15.5% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 transition-transform hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <div className="bg-destructive/20 p-2 rounded-full">
            <ArrowDownRight className="size-4 text-destructive" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">
            $
            {totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs mt-1 text-destructive/70">
            +5% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
