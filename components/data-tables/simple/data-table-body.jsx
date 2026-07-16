"use client";

import { flexRender } from "@tanstack/react-table";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import AddButton from "@/components/form/add-button";

import { DatabaseSearch } from "lucide-react";

export function DataTableBody({ table }) {
  const rows = table.getRowModel().rows;
  // Derived from the table itself so the empty-state cell always spans the
  // correct width, even as columns are hidden/shown via the toolbar.
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  if (!rows.length) {
    return (
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={visibleColumnCount}
            className="h-32 text-center text-sm text-muted-foreground"
          >
            <div className="flex flex-col items-center justify-center gap-y-4 py-8 text-red-600">
              {/* <DatabaseSearch size={50} color="#e7000b" /> */}
              <DatabaseSearch size={50} color="#e7000b" absoluteStrokeWidth />
              <span>No results.</span>
              <AddButton variation="plain" />
              
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row, i) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? "selected" : undefined}
          className={cn(
            "border-b border-border/40 transition-colors last:border-0",
            "hover:bg-muted/40",
            "data-[state=selected]:bg-primary/5",
            i % 2 === 1 && "bg-muted/[0.15]",
          )}
        >
          {row.getVisibleCells().map((cell, index) => {
            const isFirst = index === 0;
            const isLast = index === row.getVisibleCells().length - 1;
            return (
              <TableCell
                key={cell.id}
                className={cn(
                  "px-4 py-3 text-sm",
                  isFirst && "sticky-cell-left",
                  isLast && "sticky-cell-right"
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
