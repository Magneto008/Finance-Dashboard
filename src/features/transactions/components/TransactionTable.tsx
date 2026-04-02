import {
  type ComponentPropsWithoutRef,
  useMemo,
  useRef,
  useState,
} from "react";
import * as chrono from "chrono-node";
import type { Transaction } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock3, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  transactions: Transaction[];
};

type SortField = "date" | "amount" | "category" | "type" | "id";
type SortDirection = "asc" | "desc";

function SortIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 18H9V16H3V18ZM3 6V8H21V6H3ZM3 13H15V11H3V13Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSortedTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const dateResults = searchTerm ? chrono.parse(searchTerm) : [];

    return [...transactions]
      .filter((transaction) => {
        if (typeFilter !== "all" && transaction.type !== typeFilter) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const matchesDate = dateResults.some((result) => {
          const { start, end } = result;
          const tDate = new Date(transaction.date);

          if (end) {
            return tDate >= start.date() && tDate <= end.date();
          }

          if (result.text.toLowerCase().includes("week")) {
            const startRange = start.date();
            const endRange = new Date(startRange);
            endRange.setDate(endRange.getDate() + 7);
            return tDate >= startRange && tDate <= endRange;
          }

          const matchesYear = start.isCertain("year")
            ? tDate.getFullYear() === start.get("year")
            : true;
          const matchesMonth = start.isCertain("month")
            ? tDate.getMonth() === (start.get("month") || 0) - 1
            : true;
          const matchesDay = start.isCertain("day")
            ? tDate.getDate() === start.get("day")
            : true;

          const anySpecified =
            start.isCertain("year") ||
            start.isCertain("month") ||
            start.isCertain("day");

          return anySpecified && matchesYear && matchesMonth && matchesDay;
        });

        const searchableParts = [
          transaction.id,
          transaction.date,
          transaction.category,
          transaction.type,
          transaction.amount.toString(),
        ];

        return (
          matchesDate ||
          searchableParts.some((part) =>
            part.toLowerCase().includes(normalizedSearch),
          )
        );
      })
      .sort((a, b) => {
        const directionFactor = sortDirection === "asc" ? 1 : -1;

        if (sortField === "amount") {
          return (a.amount - b.amount) * directionFactor;
        }

        if (sortField === "date") {
          return (
            (new Date(a.date).getTime() - new Date(b.date).getTime()) *
            directionFactor
          );
        }

        return a[sortField].localeCompare(b[sortField]) * directionFactor;
      });
  }, [transactions, searchTerm, typeFilter, sortField, sortDirection]);

  const handleSearchTooltipOpenChange = (nextOpen: boolean) => {
    if (hideSearchTooltip) return;

    // Tooltip should only open from input focus, never hover.
    if (nextOpen) return;

    if (!nextOpen && document.activeElement === searchInputRef.current) {
      return;
    }
    setIsSearchTooltipOpen(nextOpen);
  };

  const handleHideSearchTooltip = () => {
    setHideSearchTooltip(true);
    setIsSearchTooltipOpen(false);
    window.localStorage.setItem("finance-dashboard-hide-search-tooltip", "true");
  };

  const handleColumnSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortOptionValue = `${sortField}:${sortDirection}`;

  const handleSortOptionChange = (value: string) => {
    const [field, direction] = value.split(":") as [SortField, SortDirection];
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
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

    // Wait until the pagination state update is flushed, then scroll the page.
    requestAnimationFrame(() => {
      const top = tableTop.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
    });
  };

  const totalItems = filteredAndSortedTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    endIndex,
  );

  return (
    <Card className="overflow-hidden py-0 gap-0 rounded-lg">
      <div ref={tableTopRef} />
      <CardHeader className="border-b bg-muted/20 py-4 px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock3 className="size-5 text-primary" />
            Transaction History
          </CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Tooltip
              open={isSearchTooltipOpen}
              onOpenChange={handleSearchTooltipOpenChange}
            >
              <TooltipTrigger asChild>
                <div className="relative w-full lg:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                    onFocus={() => {
                      if (!hideSearchTooltip) setIsSearchTooltipOpen(true);
                    }}
                    onBlur={() => {
                      requestAnimationFrame(() => {
                        if (document.activeElement !== searchInputRef.current) {
                          setIsSearchTooltipOpen(false);
                        }
                      });
                    }}
                    className="pl-9 pr-9 focus-visible:ring-1"
                  />
                  {searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 size-7 rounded-full text-muted-foreground hover:text-foreground"
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSearchTerm("");
                        searchInputRef.current?.focus();
                      }}
                    >
                      <X className="size-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="p-3 shadow-xl border-border border bg-popover text-popover-foreground max-w-80"
              >
                <div className="relative space-y-2 pr-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -right-1 -top-1 size-6 text-muted-foreground hover:text-foreground"
                    onClick={handleHideSearchTooltip}
                  >
                    <X className="size-3.5" />
                    <span className="sr-only">Close tooltip</span>
                  </Button>
                  <p className="font-semibold text-xs text-primary flex items-center gap-1.5">
                    <Sparkles className="size-3" />
                    Natural Language Search
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Try typing periods like{" "}
                    <span className="text-foreground font-medium italic">
                      "last 2 weeks"
                    </span>
                    ,
                    <span className="text-foreground font-medium italic">
                      "February"
                    </span>
                    , or
                    <span className="text-foreground font-medium italic">
                      "last year"
                    </span>
                    .
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["last week", "yesterday", "january", "2023"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={typeFilter}
                onValueChange={(value) =>
                  value &&
                  (() => {
                    setTypeFilter(value as "all" | "income" | "expense");
                    setCurrentPage(1);
                  })()
                }
              >
                <SelectTrigger className="w-27.5 flex-1 sm:flex-none">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOptionValue}
                onValueChange={handleSortOptionChange}
              >
                <SelectTrigger className="w-44 flex-1 sm:flex-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id:asc">ID (Ascending)</SelectItem>
                  <SelectItem value="id:desc">ID (Descending)</SelectItem>
                  <SelectItem value="date:asc">Date (Ascending)</SelectItem>
                  <SelectItem value="date:desc">Date (Descending)</SelectItem>
                  <SelectItem value="category:asc">
                    Category (Ascending)
                  </SelectItem>
                  <SelectItem value="category:desc">
                    Category (Descending)
                  </SelectItem>
                  <SelectItem value="type:asc">Type (Ascending)</SelectItem>
                  <SelectItem value="type:desc">Type (Descending)</SelectItem>
                  <SelectItem value="amount:asc">Amount (Ascending)</SelectItem>
                  <SelectItem value="amount:desc">
                    Amount (Descending)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

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
                    className="group h-auto p-0 font-medium"
                  >
                    <span>ID</span>
                    <SortIcon
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
                    className="group h-auto p-0 font-medium"
                  >
                    <span>Date</span>
                    <SortIcon
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
                    className="group h-auto p-0 font-medium"
                  >
                    <span>Category</span>
                    <SortIcon
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
                    className="group h-auto p-0 font-medium"
                  >
                    <span>Type</span>
                    <SortIcon
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
                    className="group ml-auto h-auto p-0 font-medium"
                  >
                    <SortIcon
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
        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {totalItems === 0
              ? "Showing 0 of 0 transactions"
              : `Showing ${startIndex + 1}-${endIndex} of ${totalItems} transactions`}
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Rows per page
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Page {safeCurrentPage} of {totalPages}
              </span>
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(Math.max(1, safeCurrentPage - 1));
                    scrollToTableTop();
                  }}
                  disabled={safeCurrentPage <= 1}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, safeCurrentPage + 1));
                    scrollToTableTop();
                  }}
                  disabled={safeCurrentPage >= totalPages}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
