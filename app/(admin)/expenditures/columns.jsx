"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Date",
    accessorKey: "c",
  },
  {
    header: "Invoice",
    accessorKey: "a",
  },
  {
    header: "Supplier",
    accessorKey: "a",
  },
  {
    header: "Amount",
    accessorKey: "a",
  },
  {
    header: "Status",
    accessorKey: "a",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionsBtns
        record={row.original}
        useStore={useWarehouseStore}
      />
    ),
  },
];

/*

Expense Date
Expand Line Items
Invoice
Vendor
Amount
Status
Payment Date
Expenditure
Created At
Acknowledgement
Petty Expenditure
Acceptance Status
Email Vendor
Reverse Charge Applicable
Sub Total
Expenditure Amount in PKR
Tags
Scanned Document
Workflow Name
Current Assignee
Current Stage
Current Status

*/