import { useMemo, useRef, useState } from "react";
import type { Transaction } from "@/shared/types/finance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  SortDirection,
  SortField,
  TypeFilter,
} from "@/features/transactions/types/table";
import { filterAndSortTransactions } from "@/features/transactions/lib/filterAndSortTransactions";
import { TransactionTableSortIcon } from "@/features/transactions/components/table/TransactionTableSortIcon";
import { TransactionTableToolbar } from "@/features/transactions/components/table/TransactionTableToolbar";
import { TransactionTablePagination } from "@/features/transactions/components/table/TransactionTablePagination";

type Props = {
  transactions: Transaction[];
};

export const TransactionTable = ({ transactions }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchTooltipOpen, setIsSearchTooltipOpen] = useState(false);
  const [hideSearchTooltip, setHideSearchTooltip] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.localStorage.getItem("finance-dashboard-hide-search-tooltip") ===
      "true"
    );
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableTopRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSortedTransactions = useMemo(
    () =>
      filterAndSortTransactions({
        transactions,
        searchTerm,
        typeFilter,
        sortField,
        sortDirection,
      }),
    [transactions, searchTerm, typeFilter, sortField, sortDirection],
  );

  const totalItems = filteredAndSortedTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    endIndex,
  );

  const resetToFirstPage = () => setCurrentPage(1);

  const handleSearchTooltipOpenChange = (nextOpen: boolean) => {
    if (hideSearchTooltip) return;
    if (nextOpen) return;

    if (!nextOpen && document.activeElement === searchInputRef.current) {
      return;
    }
    setIsSearchTooltipOpen(nextOpen);
  };

  const handleHideSearchTooltip = () => {
    setHideSearchTooltip(true);
    setIsSearchTooltipOpen(false);
    window.localStorage.setItem(
      "finance-dashboard-hide-search-tooltip",
      "true",
    );
  };

  const handleSearchFocus = () => {
    if (!hideSearchTooltip) {
      setIsSearchTooltipOpen(true);
    }
  };

  const handleSearchBlur = () => {
    requestAnimationFrame(() => {
      if (document.activeElement !== searchInputRef.current) {
        setIsSearchTooltipOpen(false);
      }
    });
  };

  const handleColumnSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    resetToFirstPage();
  };

  const handleSortOptionChange = (value: string) => {
    const [field, direction] = value.split(":") as [SortField, SortDirection];
    setSortField(field);
    setSortDirection(direction);
    resetToFirstPage();
  };

  const getSortIconClass = (field: SortField) =>
    cn(
      "size-4.5 transition-all duration-200",
      sortField !== field &&
        "text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
      sortField === field && "opacity-100",
      sortField === field &&
        sortDirection === "asc" &&
        "rotate-180 -scale-x-100",
    );

  const scrollToTableTop = () => {
    const tableTop = tableTopRef.current;
    if (!tableTop) return;

    requestAnimationFrame(() => {
      const top = tableTop.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
    });
  };

  return (
    <Card className="overflow-hidden py-0 gap-0 rounded-lg">
      <div ref={tableTopRef} />
      <TransactionTableToolbar
        searchTerm={searchTerm}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          resetToFirstPage();
        }}
        searchInputRef={searchInputRef}
        isSearchTooltipOpen={isSearchTooltipOpen}
        onSearchTooltipOpenChange={handleSearchTooltipOpenChange}
        onHideSearchTooltip={handleHideSearchTooltip}
        onSearchFocus={handleSearchFocus}
        onSearchBlur={handleSearchBlur}
        typeFilter={typeFilter}
        onTypeFilterChange={(value) => {
          setTypeFilter(value);
          resetToFirstPage();
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortOptionChange={handleSortOptionChange}
      />

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleColumnSort("id")}
                    className="group h-auto p-0 font-medium hover:bg-transparent dark:hover:bg-transparent"
                  >
                    <span>ID</span>
                    <TransactionTableSortIcon
                      className={cn(
                        "ml-1",
                        getSortIconClass("id"),
                        sortField !== "id" &&
                          "group-hover:rotate-180 group-hover:-scale-x-100",
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleColumnSort("date")}
                    className="group h-auto p-0 font-medium hover:bg-transparent dark:hover:bg-transparent"
                  >
                    <span>Date</span>
                    <TransactionTableSortIcon
                      className={cn(
                        "ml-1",
                        getSortIconClass("date"),
                        sortField !== "date" &&
                          "group-hover:rotate-180 group-hover:-scale-x-100",
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleColumnSort("category")}
                    className="group h-auto p-0 font-medium hover:bg-transparent dark:hover:bg-transparent"
                  >
                    <span>Category</span>
                    <TransactionTableSortIcon
                      className={cn(
                        "ml-1",
                        getSortIconClass("category"),
                        sortField !== "category" &&
                          "group-hover:rotate-180 group-hover:-scale-x-100",
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleColumnSort("type")}
                    className="group h-auto p-0 font-medium hover:bg-transparent dark:hover:bg-transparent"
                  >
                    <span>Type</span>
                    <TransactionTableSortIcon
                      className={cn(
                        "ml-1",
                        getSortIconClass("type"),
                        sortField !== "type" &&
                          "group-hover:rotate-180 group-hover:-scale-x-100",
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleColumnSort("amount")}
                    className="group ml-auto h-auto p-0 font-medium hover:bg-transparent dark:hover:bg-transparent"
                  >
                    <TransactionTableSortIcon
                      className={cn(
                        "mr-1",
                        getSortIconClass("amount"),
                        sortField !== "amount" &&
                          "group-hover:rotate-180 group-hover:-scale-x-100",
                      )}
                      aria-hidden="true"
                    />
                    <span>Amount</span>
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalItems === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((t) => (
                  <TableRow
                    key={t.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-mono uppercase text-muted-foreground">
                      {t.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {t.date}
                    </TableCell>
                    <TableCell className="capitalize">{t.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "shadow-none",
                          t.type === "income"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right",
                        t.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground",
                      )}
                    >
                      {t.type === "income" ? "+" : "-"}$
                      {Number(t.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TransactionTablePagination
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          pageSize={pageSize}
          safeCurrentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageSizeChange={(value) => {
            setPageSize(value);
            resetToFirstPage();
          }}
          onPreviousPage={() => {
            setCurrentPage(Math.max(1, safeCurrentPage - 1));
            scrollToTableTop();
          }}
          onNextPage={() => {
            setCurrentPage(Math.min(totalPages, safeCurrentPage + 1));
            scrollToTableTop();
          }}
        />
      </CardContent>
    </Card>
  );
};
