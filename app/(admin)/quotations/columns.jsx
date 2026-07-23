"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Quot No.",
    accessorKey: "quotation_number",
  },
  {
    header: "Quote To",
    accessorKey: "quote_to",
    cell: ({ row }) => <span>{row.original.company?.title ?? "-"}</span>,
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionsBtns record={row.original} useStore={useWarehouseStore} />
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
