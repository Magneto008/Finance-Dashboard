import { useMemo, useState } from "react";
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
import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  transactions: Transaction[];
};

type SortField = "date" | "amount" | "category" | "type" | "id";
type SortDirection = "asc" | "desc";

export const TransactionTable = ({ transactions }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
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

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <CardHeader className="border-b bg-muted/20 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-lg font-semibold">
            Transaction History
          </CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex items-center gap-2">
              <Select
                value={typeFilter}
                onValueChange={(value) =>
                  value && setTypeFilter(value as "all" | "income" | "expense")
                }
              >
                <SelectTrigger className="w-27.5 bg-background">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortField}
                onValueChange={(value) =>
                  value && setSortField(value as SortField)
                }
              >
                <SelectTrigger className="w-27.5 bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortDirection}
                className="shrink-0"
              >
                {sortDirection === "asc" ? (
                  <ArrowUpAZ className="h-4 w-4" />
                ) : (
                  <ArrowDownAZ className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle Sort Direction</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTransactions.map((t) => (
                  <TableRow
                    key={t.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-mono text-[10px] uppercase tracking-tighter text-muted-foreground">
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
                        "text-right font-bold font-mono",
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
      </CardContent>
    </Card>
  );
};
