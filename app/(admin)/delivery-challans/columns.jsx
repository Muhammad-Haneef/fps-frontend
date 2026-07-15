"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Date",
    accessorKey: "a",
  },
  {
    header: "DC No.",
    accessorKey: "a",
  },
  {
    header: "Diliverd To",
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
Delivery Challan
Delivered To
Amount
Status
Acceptance Status
Delivery Challan Email
Trade/Legal Name
Sub Total
Delivery Challan Amount in PKR
Tags
Shopify Order Number
Signature Status
*/