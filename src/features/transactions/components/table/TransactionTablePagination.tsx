import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  totalItems: number;
  startIndex: number;
  endIndex: number;
  pageSize: number;
  safeCurrentPage: number;
  totalPages: number;
  onPageSizeChange: (value: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export const TransactionTablePagination = ({
  totalItems,
  startIndex,
  endIndex,
  pageSize,
  safeCurrentPage,
  totalPages,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
}: Props) => {
  return (
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
            onValueChange={(value) => onPageSizeChange(Number(value))}
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
              onClick={onPreviousPage}
              disabled={safeCurrentPage <= 1}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={safeCurrentPage >= totalPages}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
