"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "PR No",
    accessorKey: "a",
  },
  {
    header: "Invoices",
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
Expand Purchases
Payout Receipt
Vendor
Amount
Status
Email Vendor
Shopify Order Number
Signature Status

*/