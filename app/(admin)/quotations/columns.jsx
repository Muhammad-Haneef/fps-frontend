"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Code",
    accessorKey: "date",
  },
  {
    header: "Quot No.",
    accessorKey: "a",
  },
  {
    header: "Quote To",
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
    header: "Status",
    accessorKey: "a",
  },
  {
    header: "Payment Date",
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
Acceptance Status
Quotation Email
Reverse Charge Applicable
Sub Total
Quotation Amount in PKR
Tags
Workflow Name
Current Assignee
Current Stage
Current Status
Shopify Order Number
Signature Status
*/