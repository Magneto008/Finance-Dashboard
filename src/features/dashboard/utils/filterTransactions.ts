import type { Transaction, FilterGroup } from "@/types";

/**
 * Filter transactions based on multiple groups of conditions.
 * Groups are combined with OR.
 * Conditions within a group are combined with AND.
 */
export const filterTransactions = (
  transactions: Transaction[],
  filterGroups: FilterGroup[]
): Transaction[] => {
  // If no filters are applied, return all transactions
  if (filterGroups.length === 0 || filterGroups.every((g) => g.conditions.length === 0)) {
    return transactions;
  }

  return transactions.filter((tx) => {
    // Check if the transaction passes *any* of the filter groups (OR)
    return filterGroups.some((group) => {
      if (group.conditions.length === 0) return false;
      const shouldMatchAll = group.conditionJoin !== "OR";

      const conditionMatches = group.conditions.map((cond) => {
        const txValue = tx[cond.field];

        switch (cond.operator) {
          case "=":
            return String(txValue).toLowerCase() === String(cond.value).toLowerCase();
          case ">":
            return Number(txValue) > Number(cond.value);
          case "<":
            return Number(txValue) < Number(cond.value);
          case "contains":
            return String(txValue).toLowerCase().includes(String(cond.value).toLowerCase());
          default:
            return true;
        }
      });

      return shouldMatchAll
        ? conditionMatches.every((isMatch) => isMatch)
        : conditionMatches.some((isMatch) => isMatch);
    });
  });
};
