"use client";

import { flexRender } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function DataTableHeader({ table }) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="border-b border-border/60 bg-muted/40 hover:bg-muted/40"
        >
          {headerGroup.headers.map((header, index) => {
            const sortable = header.column.getCanSort();
            const sortState = header.column.getIsSorted();
            const isFirst = index === 0;
            const isLast = index === headerGroup.headers.length - 1;

            return (
              <TableHead
                key={header.id}
                className={cn(
                  "h-10 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                  header.column.id === "serial" && "w-12",
                  isFirst && "sticky-header-left",
                  isLast && "sticky-header-right"
                )}
              >
                {header.isPlaceholder ? null : sortable ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <ArrowUpDown
                      className={cn(
                        "h-3.5 w-3.5 transition-colors",
                        sortState
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                      )}
                    />
                  </button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
