"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Inv No.",
    accessorKey: "a",
  },
  {
    header: "Billed To",
    accessorKey: "a",
  },
  {
    header: "Items",
    accessorKey: "a",
  },
  {
    header: "Amount",
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

Date
Expand Line Items
Invoice
Billed To
Amount
Status
Payment Date
Acceptance Status
Invoice Email
Reverse Charge Applicable
Sub Total
Invoice Amount in PKR
Tags
Scanned Document
Workflow Name
Current Assignee
Current Stage
Current Status
Signature Status
*/