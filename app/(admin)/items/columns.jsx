"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Warehouse",
    accessorKey: "a",
  },
  {
    header: "SKU",
    accessorKey: "a",
  },
  {
    header: "Image",
    accessorKey: "a",
  },
  {
    header: "Product Name",
    accessorKey: "a",
  },
  {
    header: "Buying Price",
    accessorKey: "a",
  },
  {
    header: "Selling Price",
    accessorKey: "a",
  },
  {
    header: "Landed Cost",
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
Warehouse Details
SKU
Image
Original Image
item
Item Type
Buying Price
Selling Price
Landed Cost
Tax Rate(in %)
Manage Stock
Strict Control
Is Sales Item
Category
Total Stock
Length
Breadth
Height
Volume (in m³)
Gross weight
Net Weight
Stock in Hand
Net Committed Stock
Stock Status
Reorder Point
Overstock Point
Unit
Average Selling Price
Average Buying Price
Total Sold Quantity
Total Purchase Quantity
Tags
Tracking Method
*/