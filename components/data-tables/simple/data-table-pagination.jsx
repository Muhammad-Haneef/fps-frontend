"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getPageNumbers } from "./utils";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

export function DataTablePagination({ table, totalRows, position }) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const pageNumbers = getPageNumbers(pageIndex, pageCount);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between",
        position === "top" && "sm:flex-row-reverse"
      )}
    >
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Rows per page</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {totalRows === 0
            ? "No rows"
            : `${pageIndex * pageSize + 1}–${Math.min(
                (pageIndex + 1) * pageSize,
                totalRows
              )} of ${totalRows}`}
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((page, i) =>
            page === "…" ? (
              <span
                key={`ellipsis-${i}`}
                className="px-1.5 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={page === pageIndex + 1 ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-sm"
                onClick={() => table.setPageIndex(page - 1)}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
