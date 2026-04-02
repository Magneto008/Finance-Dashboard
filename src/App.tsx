import { useState, useEffect } from "react";
import { AppProvider } from "@/app/providers/AppProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSummary } from "@/features/dashboard/components/DashboardSummary";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { InsightsOverview } from "@/features/insights/components/InsightsOverview";
import { AdvancedFilter } from "@/features/filters/components/AdvancedFilter";
import { filterTransactions } from "@/features/filters/lib/filterTransactions";
import {
  exportToJSON,
  exportToCSV,
  exportToExcel,
} from "@/features/transactions/lib/transactionsExport";
import type { FilterGroup, Role } from "@/shared/types/finance";
import { useAppContext } from "@/app/context/AppContext";
import { useTheme } from "@/app/context/ThemeContext";
import { AppHeader } from "@/app/components/AppHeader";
import { AppTopBar } from "@/app/components/AppTopBar";
import type { AppTab } from "@/app/components/types";

const MainLayout = () => {
  const { state, dispatch } = useAppContext();
  const { setTheme, theme } = useTheme();

  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    const saved = localStorage.getItem("finance-dashboard-active-tab");
    if (
      saved === "dashboard" ||
      saved === "transactions" ||
      saved === "insights"
    ) {
      return saved as AppTab;
    }
    return "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("finance-dashboard-active-tab", activeTab);
  }, [activeTab]);

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
      <AppHeader
        role={state.role}
        onSetRole={handleSetRole}
        theme={theme}
        onSetTheme={setTheme}
      />

      <main className="container mx-auto flex-1 px-4 py-4 md:pb-8">
        <AppTopBar
          activeTab={activeTab}
          onSetActiveTab={setActiveTab}
          role={state.role}
          filteredTransactions={filteredTransactions}
          onExportJSON={exportToJSON}
          onExportCSV={exportToCSV}
          onExportExcel={exportToExcel}
        />

        {activeTab !== "insights" && (
          <div className="mt-4">
            <AdvancedFilter
              filterGroups={state.filterGroups}
              setFilterGroups={handleSetFilters}
            />
          </div>
        )}

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
        <TooltipProvider>
          <MainLayout />
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
