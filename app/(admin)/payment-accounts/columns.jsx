"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Payment Account",
    accessorKey: "a",
  },
  {
    header: "Account Type",
    accessorKey: "a",
  },
  {
    header: "Linked Bank",
    accessorKey: "a",
  },
  {
    header: "Linked Employee",
    accessorKey: "a",
  },
  {
    header: "Linked Ledger",
    accessorKey: "a",
  },
  {
    header: "VPA",
    accessorKey: "a",
  },
  {
    header: "Created At",
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
