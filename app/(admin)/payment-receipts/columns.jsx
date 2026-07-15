"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Date",
    accessorKey: "",
  },
  {
    header: "PR No.",
    accessorKey: "",
  },
  {
    header: "Invoices",
    accessorKey: "",
  },
  {
    header: "Billed To",
    accessorKey: "",
  },
  {
    header: "Amount",
    accessorKey: "",
  },
  {
    header: "Status",
    accessorKey: "",
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
Expand Invoices
Payment Receipt
Billed To
Amount
Status
Payment Receipt Email
Shopify Order Number
Signature Status

*/