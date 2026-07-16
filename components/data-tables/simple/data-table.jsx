"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import DataTableSkeleton from "@/components/skeletons/data-table";
import { createSerialColumn } from "./utils";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableHeader } from "./data-table-header";
import { DataTableBody } from "./data-table-body";
import { DataTablePagination } from "./data-table-pagination";

export function DataTable({
  columns,
  data,
  reportName = "Data Report",
  companyName = "Your Company",
  logoUrl,
  loading,
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});

  const tableColumns = useMemo(
    () => [createSerialColumn(), ...columns],
    [columns],
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
    // TanStack calls resetPageIndex() synchronously during render whenever it
    // detects columns/data changed, which React flags as an invalid state
    // update if it fires before mount. We turn that off and instead reset the
    // page manually — inside the search handler below, which is a safe event
    // handler context — whenever a new search actually narrows the results.
    autoResetPageIndex: false,
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const handleGlobalFilterChange = (value) => {
    setGlobalFilter(value);
    table.setPageIndex(0);
  };

  const totalRows = table.getFilteredRowModel().rows.length;
  if(loading)
  return <DataTableSkeleton columns={6} rows={8} />;
  return (
    <div className="space-y-3">
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        reportName={reportName}
        companyName={companyName}
        logoUrl={logoUrl}
      />

      <DataTablePagination table={table} totalRows={totalRows} position="top" />

      <div className="overflow-hidden rounded-md border border-border/60 bg-card shadow-lg">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} />
        </Table>
      </div>

      <DataTablePagination
        table={table}
        totalRows={totalRows}
        position="bottom"
      />
    </div>
  );
}
