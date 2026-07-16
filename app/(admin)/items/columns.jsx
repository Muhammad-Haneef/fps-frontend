"use client";

import ActionsBtns from "@/components/actions-btns";
import { useItemStore } from "@/stores/useItemStore";

export const Columns = [

  {
    header: "Warehouse Details",
    accessorKey: "warehouse_details",
  },
  {
    header: "SKU",
    accessorKey: "sku",
  },
  {
    header: "Image",
    accessorKey: "image",
  },
  {
    header: "Original Image",
    accessorKey: "original_image",
  },
  {
    header: "Item Name",
    accessorKey: "title",
  },
  {
    header: "Item Type",
    accessorKey: "item_type",
  },
  /*
    {
      header: "Buying Price",
      accessorKey: "buying_price",
    },
    {
      header: "Selling Price",
      accessorKey: "selling_price",
    },
    {
      header: "Landed Cost",
      accessorKey: "landed_cost",
    },
    {
      header: "Tax Rate (%)",
      accessorKey: "tax_rate",
    },
    {
      header: "Manage Stock",
      accessorKey: "manage_stock",
    },
    {
      header: "Strict Control",
      accessorKey: "strict_control",
    },
    {
      header: "Is Sales Item",
      accessorKey: "is_sales_item",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Total Stock",
      accessorKey: "total_stock",
    },
    {
      header: "Length",
      accessorKey: "length",
    },
    {
      header: "Breadth",
      accessorKey: "breadth",
    },
    {
      header: "Height",
      accessorKey: "height",
    },
    {
      header: "Volume (m³)",
      accessorKey: "volume",
    },
    {
      header: "Gross Weight",
      accessorKey: "gross_weight",
    },
    {
      header: "Net Weight",
      accessorKey: "net_weight",
    },
    {
      header: "Stock in Hand",
      accessorKey: "stock_in_hand",
    },
    {
      header: "Net Committed Stock",
      accessorKey: "net_committed_stock",
    },
    {
      header: "Stock Status",
      accessorKey: "stock_status",
    },
    {
      header: "Reorder Point",
      accessorKey: "reorder_point",
    },
    {
      header: "Overstock Point",
      accessorKey: "overstock_point",
    },
    {
      header: "Unit",
      accessorKey: "unit",
    },
    {
      header: "Average Selling Price",
      accessorKey: "average_selling_price",
    },
    {
      header: "Average Buying Price",
      accessorKey: "average_buying_price",
    },
    {
      header: "Total Sold Quantity",
      accessorKey: "total_sold_quantity",
    },
    {
      header: "Total Purchase Quantity",
      accessorKey: "total_purchase_quantity",
    },
    {
      header: "Tags",
      accessorKey: "tags",
    },
    {
      header: "Tracking Method",
      accessorKey: "tracking_method",
    },
    */
  {
    header: () => <div className="text-center">Actions</div>,
    id: "last",
    cell: ({ row }) => (
      <ActionsBtns
        record={row.original}
        useStore={useItemStore}
      />
    ),
  },
];