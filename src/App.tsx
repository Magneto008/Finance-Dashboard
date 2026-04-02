import { useState } from "react";
import { AppProvider } from "@/app/providers/AppProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { DashboardSummary } from "@/features/dashboard/components/DashboardSummary";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { InsightsOverview } from "@/features/insights/components/InsightsOverview";
import { AdvancedFilter } from "@/shared/components/AdvancedFilter";
import { filterTransactions } from "@/features/dashboard/utils/filterTransactions";
import { exportToJSON, exportToCSV, exportToExcel } from "@/shared/lib/export";
import type { FilterGroup, Role } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileDown,
  Moon,
  Sun,
  Monitor,
  LayoutDashboard,
  ShieldAlert,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/app/context/AppContext";
import { useTheme } from "@/app/context/ThemeContext";

const MainLayout = () => {
  const { state, dispatch } = useAppContext();
  const { setTheme, theme } = useTheme();

  // Local state for advanced UI
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "transactions" | "insights"
  >("dashboard");

  const filteredTransactions = filterTransactions(
    state.transactions,
    state.filterGroups,
  );

  const handleSetRole = (role: Role) => {
    dispatch({ type: "SET_ROLE", payload: role });
  };

  const handleSetFilters = (filters: FilterGroup[]) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="size-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              FinanceDash
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher */}
            <div className="flex items-center gap-2 max-sm:hidden">
              {state.role === "admin" ? (
                <ShieldAlert className="size-5 text-muted-foreground" />
              ) : (
                <User className="size-5 text-muted-foreground" />
              )}
              <Select
                value={state.role}
                onValueChange={(val) => handleSetRole(val as Role)}
              >
                <SelectTrigger className="h-8 w-30 text-xs">
                  <SelectValue>
                    {state.role === "admin" ? "Admin" : "Viewer"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full border border-border"
                >
                  {theme === "light" ? (
                    <Sun className="size-4" />
                  ) : theme === "dark" ? (
                    <Moon className="size-4" />
                  ) : (
                    <Monitor className="size-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-4 md:pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Tabs: Full width and centered on mobile */}
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 w-full md:w-fit overflow-x-auto">
            <Button
              size="sm"
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="flex-1 md:flex-none px-4"
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </Button>

            <Button
              size="sm"
              variant={activeTab === "transactions" ? "default" : "ghost"}
              className="flex-1 md:flex-none px-4"
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </Button>

            <Button
              size="sm"
              variant={activeTab === "insights" ? "default" : "ghost"}
              className="flex-1 md:flex-none px-4"
              onClick={() => setActiveTab("insights")}
            >
              Insights
            </Button>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {activeTab === "transactions" && (
              <div className="flex-1 md:flex-none">
                <TransactionForm />
              </div>
            )}

            <div className="flex-1 md:flex-none">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full whitespace-nowrap"
                    disabled={!filteredTransactions.length}
                  >
                    <Download className="size-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => exportToJSON(filteredTransactions)}
                  >
                    <FileDown className="size-4 mr-2" />
                    JSON
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => exportToCSV(filteredTransactions)}
                  >
                    <FileDown className="size-4 mr-2" />
                    CSV
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => exportToExcel(filteredTransactions)}
                  >
                    <Download className="size-4 mr-2" />
                    Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* 🔍 Filters */}
        {activeTab !== "insights" && (
          <div className="mt-4">
            <AdvancedFilter
              filterGroups={state.filterGroups}
              setFilterGroups={handleSetFilters}
            />
          </div>
        )}

        {/* 📊 Content */}
        <div className="mt-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <DashboardSummary transactions={filteredTransactions} />
              <DashboardCharts transactions={filteredTransactions} />
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <TransactionTable transactions={filteredTransactions} />
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <InsightsOverview transactions={state.transactions} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="finance-dashboard-theme">
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
