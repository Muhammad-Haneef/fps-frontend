"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Accounts",
    accessorKey: "a",
  },
  {
    header: "Account Group Name",
    accessorKey: "a",
  },
  {
    header: "Category",
    accessorKey: "a",
  },
  {
    header: "Type",
    accessorKey: "a",
  },
  {
    header: "Show Balances",
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






