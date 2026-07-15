"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Name",
    accessorKey: "title",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Dimensions",
    accessorKey: "dimensions",
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