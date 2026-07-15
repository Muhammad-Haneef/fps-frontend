"use client";

import ActionsBtns from "@/components/actions-btns";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export const Columns = [
  {
    header: "Logo",
    accessorKey: "logo",
  },
  {
    header: "Company Name",
    accessorKey: "title",
  },
  {
    header: "Display Name",
    accessorKey: "display_name",
  },
  {
    header: "Phone",
    accessorKey: "phone",
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