import { type RefObject } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock3, Search, Sparkles, X } from "lucide-react";

import type {
  SortDirection,
  SortField,
  TypeFilter,
} from "@/features/transactions/types/table";

type Props = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  isSearchTooltipOpen: boolean;
  onSearchTooltipOpenChange: (nextOpen: boolean) => void;
  onHideSearchTooltip: () => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortOptionChange: (value: string) => void;
};

export const TransactionTableToolbar = ({
  searchTerm,
  onSearchTermChange,
  searchInputRef,
  isSearchTooltipOpen,
  onSearchTooltipOpenChange,
  onHideSearchTooltip,
  onSearchFocus,
  onSearchBlur,
  typeFilter,
  onTypeFilterChange,
  sortField,
  sortDirection,
  onSortOptionChange,
}: Props) => {
  const sortOptionValue = `${sortField}:${sortDirection}`;

  return (
    <CardHeader className="border-b bg-muted/20 py-4 px-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock3 className="size-5 text-primary" />
          Transaction History
        </CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Tooltip
            open={isSearchTooltipOpen}
            onOpenChange={onSearchTooltipOpenChange}
          >
            <TooltipTrigger asChild>
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(event) => onSearchTermChange(event.target.value)}
                  onFocus={onSearchFocus}
                  onBlur={onSearchBlur}
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
                      onSearchTermChange("");
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
                  onClick={onHideSearchTooltip}
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
                  {["last week", "yesterday", "january", "2023"].map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                value && onTypeFilterChange(value as TypeFilter)
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

            <Select value={sortOptionValue} onValueChange={onSortOptionChange}>
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
                <SelectItem value="amount:desc">Amount (Descending)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
