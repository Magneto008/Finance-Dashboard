import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { Download, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction, Role } from "@/shared/types/finance";
import type { AppTab } from "./types";

type Props = {
  activeTab: AppTab;
  onSetActiveTab: (tab: AppTab) => void;
  role: Role;
  filteredTransactions: Transaction[];
  onExportJSON: (transactions: Transaction[]) => void;
  onExportCSV: (transactions: Transaction[]) => void;
  onExportExcel: (transactions: Transaction[]) => void;
};

export const AppTopBar = ({
  activeTab,
  onSetActiveTab,
  role,
  filteredTransactions,
  onExportJSON,
  onExportCSV,
  onExportExcel,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 w-full md:w-fit overflow-x-auto">
        <Button
          size="sm"
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className="flex-1 md:flex-none px-4"
          onClick={() => onSetActiveTab("dashboard")}
        >
          Dashboard
        </Button>

        <Button
          size="sm"
          variant={activeTab === "transactions" ? "default" : "ghost"}
          className="flex-1 md:flex-none px-4"
          onClick={() => onSetActiveTab("transactions")}
        >
          Transactions
        </Button>

        <Button
          size="sm"
          variant={activeTab === "insights" ? "default" : "ghost"}
          className="flex-1 md:flex-none px-4"
          onClick={() => onSetActiveTab("insights")}
        >
          Insights
        </Button>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 w-full md:w-auto",
          activeTab === "transactions" && role === "viewer" && "w-full",
        )}
      >
        {activeTab === "transactions" && role === "admin" && (
          <div className="flex-1 md:flex-none">
            <TransactionForm />
          </div>
        )}

        {activeTab === "transactions" && (
          <div className={cn("flex-1 md:flex-none", role === "viewer" && "w-full")}>
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
                <DropdownMenuItem onClick={() => onExportJSON(filteredTransactions)}>
                  <FileDown className="size-4 mr-2" />
                  JSON
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onExportCSV(filteredTransactions)}>
                  <FileDown className="size-4 mr-2" />
                  CSV
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onExportExcel(filteredTransactions)}>
                  <Download className="size-4 mr-2" />
                  Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};
