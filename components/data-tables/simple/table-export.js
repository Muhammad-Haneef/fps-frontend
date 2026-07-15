import { getColumnLabel } from "./utils";

// Export target = filtered + sorted rows across ALL pages, visible columns only.
function getExportColumns(table) {
  return table
    .getAllLeafColumns()
    .filter((col) => col.getIsVisible() && col.id !== "serial");
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

export function exportToCsv(table, filename = "table-export.csv") {
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
export async function exportToExcel(table, filename = "table-export.xlsx") {
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
export async function exportToPdf(
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
