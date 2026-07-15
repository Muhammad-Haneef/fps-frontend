"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Voucher Books",
    accessorKey: "a",
  },
  {
    header: "Voucher Book Type",
    accessorKey: "a",
  },
  {
    header: "Number of Entries",
    accessorKey: "a",
  },
  {
    header: "Number of Reversed Entries",
    accessorKey: "a",
  },
  {
    header: "Last Entry Date",
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

