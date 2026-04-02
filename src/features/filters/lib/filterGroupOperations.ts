import type {
  FilterCondition,
  FilterGroup,
  LogicalOperator,
} from "@/shared/types/finance";

export const addConditionToGroup = (
  groups: FilterGroup[],
  groupId: string,
  condition: FilterCondition,
): FilterGroup[] => {
  return groups.map((group) => {
    if (group.id !== groupId) return group;
    return { ...group, conditions: [...group.conditions, condition] };
  });
};

export const updateConditionInGroup = (
  groups: FilterGroup[],
  groupId: string,
  conditionId: string,
  updates: Partial<FilterCondition>,
): FilterGroup[] => {
  return groups.map((group) => {
    if (group.id !== groupId) return group;
    return {
      ...group,
      conditions: group.conditions.map((condition) =>
        condition.id === conditionId ? { ...condition, ...updates } : condition,
      ),
    };
  });
};

export const removeConditionFromGroup = (
  groups: FilterGroup[],
  groupId: string,
  conditionId: string,
): FilterGroup[] => {
  return groups.map((group) => {
    if (group.id !== groupId) return group;
    return {
      ...group,
      conditions: group.conditions.filter(
        (condition) => condition.id !== conditionId,
      ),
    };
  });
};

export const updateGroupJoinOperator = (
  groups: FilterGroup[],
  groupId: string,
  conditionJoin: LogicalOperator,
): FilterGroup[] => {
  return groups.map((group) => {
    if (group.id !== groupId) return group;
    return { ...group, conditionJoin };
  });
};

export const removeGroupById = (
  groups: FilterGroup[],
  groupId: string,
): FilterGroup[] => {
  return groups.filter((group) => group.id !== groupId);
};
