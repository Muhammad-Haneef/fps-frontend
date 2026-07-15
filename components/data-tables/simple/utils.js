// Uses the header string when available; falls back to the column id for
// columns whose header is a custom component (e.g. sort buttons).
export function getColumnLabel(column) {
  const header = column.columnDef.header;
  return typeof header === "string" ? header : column.id;
}

// Builds a windowed list of page numbers with "…" gaps, e.g.
// [1, "…", 4, 5, 6, "…", 12]
export function getPageNumbers(pageIndex, pageCount) {
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

// A running row-number column, prepended to whatever columns the caller
// passes into <DataTable columns={...} />. Numbering continues across pages
// rather than resetting to 1 on every page.
export function createSerialColumn() {
  return {
    id: "serial",
    header: "#",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row, table }) =>
      row.index +
      1 +
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize,
  };
}
