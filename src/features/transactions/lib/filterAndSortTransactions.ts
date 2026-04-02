import * as chrono from "chrono-node";
import type { Transaction } from "@/shared/types/finance";
import type { SortDirection, SortField, TypeFilter } from "@/features/transactions/types/table";

type QueryParams = {
  transactions: Transaction[];
  searchTerm: string;
  typeFilter: TypeFilter;
  sortField: SortField;
  sortDirection: SortDirection;
};

const matchesDateQuery = (transactionDate: string, searchTerm: string): boolean => {
  const dateResults = searchTerm ? chrono.parse(searchTerm) : [];

  return dateResults.some((result) => {
    const { start, end } = result;
    const parsedDate = new Date(transactionDate);

    if (end) {
      return parsedDate >= start.date() && parsedDate <= end.date();
    }

    if (result.text.toLowerCase().includes("week")) {
      const startRange = start.date();
      const endRange = new Date(startRange);
      endRange.setDate(endRange.getDate() + 7);
      return parsedDate >= startRange && parsedDate <= endRange;
    }

    const matchesYear = start.isCertain("year")
      ? parsedDate.getFullYear() === start.get("year")
      : true;
    const matchesMonth = start.isCertain("month")
      ? parsedDate.getMonth() === (start.get("month") || 0) - 1
      : true;
    const matchesDay = start.isCertain("day")
      ? parsedDate.getDate() === start.get("day")
      : true;

    const anySpecified =
      start.isCertain("year") ||
      start.isCertain("month") ||
      start.isCertain("day");

    return anySpecified && matchesYear && matchesMonth && matchesDay;
  });
};

const matchesTextQuery = (transaction: Transaction, normalizedSearch: string): boolean => {
  const searchableParts = [
    transaction.id,
    transaction.date,
    transaction.category,
    transaction.type,
    transaction.amount.toString(),
  ];

  return searchableParts.some((part) =>
    part.toLowerCase().includes(normalizedSearch),
  );
};

export const filterAndSortTransactions = ({
  transactions,
  searchTerm,
  typeFilter,
  sortField,
  sortDirection,
}: QueryParams): Transaction[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return [...transactions]
    .filter((transaction) => {
      if (typeFilter !== "all" && transaction.type !== typeFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        matchesDateQuery(transaction.date, searchTerm) ||
        matchesTextQuery(transaction, normalizedSearch)
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
};
