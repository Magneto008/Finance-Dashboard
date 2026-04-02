import { Fragment } from "react";
import type {
  FilterOperator,
  FilterField,
  FilterCondition,
  FilterGroup,
  LogicalOperator,
} from "@/types";
import { Plus, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { Card } from "@/components/ui/card";

type Props = {
  filterGroups: FilterGroup[];
  setFilterGroups: (groups: FilterGroup[]) => void;
};

const FIELDS: FilterField[] = ["amount", "category", "type", "date"];
const OPERATORS: FilterOperator[] = ["=", ">", "<", "contains"];
const CONDITION_JOIN_OPTIONS: LogicalOperator[] = ["AND", "OR"];

export const AdvancedFilter = ({ filterGroups, setFilterGroups }: Props) => {
  const addGroup = () => {
    setFilterGroups([
      ...filterGroups,
      { id: uuidv4(), conditionJoin: "AND", conditions: [] },
    ]);
  };

  const removeGroup = (groupId: string) => {
    setFilterGroups(filterGroups.filter((g) => g.id !== groupId));
  };

  const addCondition = (groupId: string) => {
    const newCond: FilterCondition = {
      id: uuidv4(),
      field: "category",
      operator: "contains",
      value: "",
    };
    setFilterGroups(
      filterGroups.map((group) => {
        if (group.id === groupId) {
          return { ...group, conditions: [...group.conditions, newCond] };
        }
        return group;
      }),
    );
  };

  const updateCondition = (
    groupId: string,
    condId: string,
    updates: Partial<FilterCondition>,
  ) => {
    setFilterGroups(
      filterGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: group.conditions.map((c) =>
              c.id === condId ? { ...c, ...updates } : c,
            ),
          };
        }
        return group;
      }),
    );
  };

  const updateGroupJoinOperator = (
    groupId: string,
    conditionJoin: LogicalOperator,
  ) => {
    setFilterGroups(
      filterGroups.map((group) => {
        if (group.id === groupId) {
          return { ...group, conditionJoin };
        }
        return group;
      }),
    );
  };

  const removeCondition = (groupId: string, condId: string) => {
    setFilterGroups(
      filterGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: group.conditions.filter((c) => c.id !== condId),
          };
        }
        return group;
      }),
    );
  };

  const clearFilters = () => setFilterGroups([]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center bg-muted/30 p-4 rounded-lg border border-border/50">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Filter className="size-5 text-primary" /> Advanced Filters
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Build complex queries to filter your transactions.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row w-full gap-2 sm:w-auto shrink-0">
          <Button
            variant="ghost"
            onClick={clearFilters}
            disabled={filterGroups.length === 0}
            className="w-full sm:w-auto"
          >
            Clear All
          </Button>
          <Button onClick={addGroup} className="w-full sm:w-auto">
            <Plus className="size-4 mr-2" /> Add Filter Group
          </Button>
        </div>
      </div>

      {/* Groups Mapping */}
      <div className="space-y-4">
        {filterGroups.map((group, gIndex) => (
          <Fragment key={group.id}>
            {/* Visual Inter-group OR Separator */}
            {gIndex > 0 && (
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs font-bold text-muted-foreground uppercase bg-muted px-3 py-1 rounded-full tracking-wider">
                  OR
                </span>
                <div className="h-px bg-border flex-1" />
              </div>
            )}

            <Card className="overflow-hidden py-0 gap-0 shadow-md transition-all">
              {/* Group Header: Join Logic & Delete */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border/50">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Match
                  </span>
                  <Select
                    value={group.conditionJoin}
                    onValueChange={(val) =>
                      updateGroupJoinOperator(group.id, val as LogicalOperator)
                    }
                  >
                    <SelectTrigger className="w-24 h-8 bg-background font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_JOIN_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "AND" ? "ALL" : "ANY"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground font-medium">
                    of the rules:
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 w-full sm:w-auto justify-center sm:justify-start"
                  onClick={() => removeGroup(group.id)}
                  title="Delete entire group"
                >
                  <Trash2 className="size-4 sm:mr-2" />
                  <span className="sm:inline">Delete Group</span>
                </Button>
              </div>

              {/* Group Body: Conditions List */}
              <div className="p-4 space-y-3 bg-muted/90">
                {group.conditions.length === 0 && (
                  <p className="text-sm text-muted-foreground italic py-2 text-center">
                    No rules in this group yet.
                  </p>
                )}

                {group.conditions.map((cond) => (
                  <div
                    key={cond.id}
                    className="flex flex-col sm:flex-row gap-2 sm:items-center relative animate-in fade-in slide-in-from-top-1"
                  >
                    {/* Field Selection */}
                    <Select
                      value={cond.field}
                      onValueChange={(val) =>
                        updateCondition(group.id, cond.id, {
                          field: val as FilterField,
                        })
                      }
                    >
                      <SelectTrigger className="w-full sm:w-40 bg-background">
                        <SelectValue placeholder="Select Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELDS.map((f) => (
                          <SelectItem key={f} value={f}>
                            <span className="capitalize">{f}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Operator Selection */}
                    <Select
                      value={cond.operator}
                      onValueChange={(val) =>
                        updateCondition(group.id, cond.id, {
                          operator: val as FilterOperator,
                        })
                      }
                    >
                      <SelectTrigger className="w-full sm:w-32.5 bg-background">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map((op) => (
                          <SelectItem key={op} value={op}>
                            {op === "contains" ? "Contains" : op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Value Input */}
                    <Input
                      className="flex-1 min-w-37.5 bg-background"
                      value={cond.value}
                      placeholder="Enter value..."
                      onChange={(e) =>
                        updateCondition(group.id, cond.id, {
                          value: e.target.value,
                        })
                      }
                    />

                    {/* Delete Rule Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 self-end sm:self-auto"
                      onClick={() => removeCondition(group.id, cond.id)}
                      title="Remove rule"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}

                {/* Add Rule Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCondition(group.id)}
                    className="w-full sm:w-auto border-dashed hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                  >
                    <Plus className="size-4 mr-2" /> Add Rule
                  </Button>
                </div>
              </div>
            </Card>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
