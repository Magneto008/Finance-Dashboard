import type { Transaction } from "@/shared/types/finance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  buildBalanceData,
  buildCategoryData,
} from "@/features/dashboard/lib/chartData";

type Props = {
  transactions: Transaction[];
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#06b6d4",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#a855f7",
  "#14b8a6",
];
const formatCurrency = (value: unknown) => {
  if (Array.isArray(value)) {
    return `$${Number(value[0] ?? 0)}`;
  }
  return `$${Number(value ?? 0)}`;
};

export const DashboardCharts = ({ transactions }: Props) => {
  const balanceData = buildBalanceData(transactions);
  const categoryData = buildCategoryData(transactions, COLORS);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Line Chart */}
      <Card className="col-span-1 lg:col-span-4 shadow-md border-border">
        <CardHeader>
          <CardTitle>Balance History</CardTitle>
          <CardDescription>Your running balance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 h-75 w-full">
            {balanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData}>
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                    formatter={(value) => [formatCurrency(value), "Balance"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="col-span-1 lg:col-span-3 shadow-md border-border">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Where your money went</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [formatCurrency(value), "Total"]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No expenses recorded
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

