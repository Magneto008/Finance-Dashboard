import type { Transaction, FilterGroup } from "@/shared/types/finance";

export const filterTransactions = (
  transactions: Transaction[],
  filterGroups: FilterGroup[],
): Transaction[] => {
  if (
    filterGroups.length === 0 ||
    filterGroups.every((g) => g.conditions.length === 0)
  ) {
    return transactions;
  }

  return transactions.filter((tx) => {
    return filterGroups.some((group) => {
      if (group.conditions.length === 0) return false;
      const shouldMatchAll = group.conditionJoin !== "OR";

      const conditionMatches = group.conditions.map((cond) => {
        const txValue = tx[cond.field];

        switch (cond.operator) {
          case "=":
            return (
              String(txValue).toLowerCase() === String(cond.value).toLowerCase()
            );
          case ">":
            return Number(txValue) > Number(cond.value);
          case "<":
            return Number(txValue) < Number(cond.value);
          case "contains":
            return String(txValue)
              .toLowerCase()
              .includes(String(cond.value).toLowerCase());
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
