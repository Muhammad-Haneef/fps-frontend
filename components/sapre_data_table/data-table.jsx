"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

// Builds a windowed list of page numbers with "…" gaps, e.g.
// [1, "…", 4, 5, 6, "…", 12]
function getPageNumbers(pageIndex, pageCount) {
  const current = pageIndex + 1;
  const delta = 1;
  const range = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(pageCount - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) range.unshift("…");
  if (current + delta < pageCount - 1) range.push("…");

  range.unshift(1);
  if (pageCount > 1) range.push(pageCount);

  return [...new Set(range)];
}

// Uses the header string when available; falls back to the column id for
// columns whose header is a custom component (e.g. sort buttons).
function getColumnLabel(column) {
  const header = column.columnDef.header;
  return typeof header === "string" ? header : column.id;
}

// Export target = filtered + sorted rows across ALL pages, visible columns only.
function getExportColumns(table) {
  return table.getAllLeafColumns().filter(
    (col) => col.getIsVisible() && col.id !== "serial"
  );
}

function downloadBlob(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function exportToCsv(table, filename = "table-export.csv") {
  const columns = getExportColumns(table);
  const rows = table.getSortedRowModel().rows;

  const csv = [
    columns.map((col) => csvEscape(getColumnLabel(col))).join(","),
    ...rows.map((row) =>
      columns.map((col) => csvEscape(row.getValue(col.id))).join(",")
    ),
  ].join("\n");

  downloadBlob(csv, "text/csv;charset=utf-8;", filename);
}

// Requires: npm install xlsx
async function exportToExcel(table, filename = "table-export.xlsx") {
  const XLSX = await import("xlsx");
  const columns = getExportColumns(table);
  const rows = table.getSortedRowModel().rows;

  const data = rows.map((row) => {
    const record = {};
    columns.forEach((col) => {
      record[getColumnLabel(col)] = row.getValue(col.id);
    });
    return record;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, filename);
}

async function loadImageAsDataUrl(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getImageFormat(dataUrl) {
  const match = /^data:image\/(\w+);base64,/.exec(dataUrl);
  return match ? match[1].toUpperCase() : "PNG";
}

// Requires: npm install jspdf jspdf-autotable
async function exportToPdf(
  table,
  {
    filename = "table-export.pdf",
    reportName = "Data Report",
    companyName = "Company",
    logoUrl,
  } = {}
) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const columns = getExportColumns(table);
  const rows = table.getSortedRowModel().rows;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString();

  // Logo is optional — export still proceeds if it fails to load.
  let logoDataUrl = null;
  if (logoUrl) {
    try {
      logoDataUrl = await loadImageAsDataUrl(logoUrl);
    } catch {
      logoDataUrl = null;
    }
  }

  const logoWidth = 22;
  const logoHeight = 14;
  const logoY = 8;
  const titleY = logoDataUrl ? logoY + logoHeight + 6 : 14;
  const dateY = titleY + 5;
  const tableStartY = dateY + 8;

  autoTable(doc, {
    head: [columns.map((col) => getColumnLabel(col))],
    body: rows.map((row) =>
      columns.map((col) => {
        const value = row.getValue(col.id);
        return value == null ? "" : String(value);
      })
    ),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 41, 59] },
    margin: { top: tableStartY, bottom: 18 },
    // Runs on every page — draws the logo/title/date header each time.
    didDrawPage: () => {
      if (logoDataUrl) {
        doc.addImage(
          logoDataUrl,
          getImageFormat(logoDataUrl),
          pageWidth / 2 - logoWidth / 2,
          logoY,
          logoWidth,
          logoHeight
        );
      }

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(reportName, pageWidth / 2, titleY, { align: "center" });

      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.text(today, pageWidth / 2, dateY, { align: "center" });
    },
  });

  // Footer needs the final page count, which is only known once the whole
  // table has been laid out — so it's drawn in a second pass over every page.
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.text(`Prepared by: ${companyName}`, 14, pageHeight - 8);
    doc.text(`${i}/${totalPages}`, pageWidth - 14, pageHeight - 8, {
      align: "right",
    });
  }

  doc.save(filename);
}

function TablePagination({ table, totalRows, position }) {
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

export function DataTable({
  columns,
  data,
  reportName = "Data Report",
  companyName = "Your Company",
  logoUrl,
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});

  const tableColumns = useMemo(
    () => [
      {
        id: "serial",
        header: "#",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row, table }) =>
          row.index +
          1 +
          table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize,
      },
      ...columns,
    ],
    [columns]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const rows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
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

      <TablePagination table={table} totalRows={totalRows} position="top" />

      <div className="overflow-hidden rounded-md border border-border/60 bg-card shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border/60 bg-muted/40 hover:bg-muted/40"
                >
                  {headerGroup.headers.map((header) => {
                    const sortable = header.column.getCanSort();
                    const sortState = header.column.getIsSorted();

                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "h-10 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                          header.column.id === "serial" && "w-12"
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

            <TableBody>
              {rows.length ? (
                rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={cn(
                      "border-b border-border/40 transition-colors last:border-0",
                      "hover:bg-muted/40",
                      "data-[state=selected]:bg-primary/5",
                      i % 2 === 1 && "bg-muted/[0.15]"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TablePagination
        table={table}
        totalRows={totalRows}
        position="bottom"
      />
    </div>
  );
}