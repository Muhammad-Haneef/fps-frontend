"use client";

import { Download, Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { exportToCsv, exportToExcel, exportToPdf } from "./table-export";
import { getColumnLabel } from "./utils";

export function DataTableToolbar({
  table,
  globalFilter,
  onGlobalFilterChange,
  reportName,
  companyName,
  logoUrl,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {getColumnLabel(column)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Export data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => exportToCsv(table)}
                className="cursor-pointer"
              >
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToExcel(table)}
                className="cursor-pointer"
              >
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  exportToPdf(table, { reportName, companyName, logoUrl })
                }
                className="cursor-pointer"
              >
                PDF
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
