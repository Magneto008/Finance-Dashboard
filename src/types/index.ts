export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export type Role = "viewer" | "admin";

export type FilterField = "amount" | "category" | "type" | "date";
export type FilterOperator = "=" | ">" | "<" | "contains";
export type LogicalOperator = "AND" | "OR";

export type FilterCondition = {
  id: string;
  field: FilterField;
  operator: FilterOperator;
  value: string;
};

export type FilterGroup = {
  id: string;
  conditionJoin: LogicalOperator;
  conditions: FilterCondition[];
};

export type AppState = {
  transactions: Transaction[];
  role: Role;
  filterGroups: FilterGroup[];
};
