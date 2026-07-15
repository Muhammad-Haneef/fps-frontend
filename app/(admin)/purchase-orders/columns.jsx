"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Date",
    accessorKey: "a",
  },
  {
    header: "PO No.",
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
    header: "Payment Date",
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
Purchase Order
Vendor
Amount
Status
Payment Date
Convert PO
Acceptance Status
Email Vendor
Sub Total
Purchase Order Amount in PKR
Tags
Scanned Document
Account Holder Name
Bank Name
Account Number
IFSC Code
IBAN
SWIFT Code
Sort Code
Workflow Name
Current Assignee
Current Stage
Current Status
Shopify Order Number
Signature Status
*/