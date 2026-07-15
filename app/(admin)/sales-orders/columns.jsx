"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Date",
    accessorKey: "a",
  },
  {
    header: "SO No.",
    accessorKey: "a",
  },
  {
    header: "Billed To",
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

Date
Expand Line Items
Sales Order
Billed To
Amount
Status
Convert to Invoice
Acceptance Status
Sales Order Email
Sub Total
Sales Order Amount in PKR
Tags
Scanned Document
Account Holder Name
Bank Name
Account Number
IFSC Code
IBAN
SWIFT Code
Sort Code
Shopify Order Number
Signature Status

*/