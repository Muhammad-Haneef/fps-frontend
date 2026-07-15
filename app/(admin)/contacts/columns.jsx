"use client";

import ActionsBtns from "@/components/actions-btns";
import { useContactStore } from "@/stores/useContactStore";

export const Columns = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Contact",
    accessorKey: "phone",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Country",
    accessorKey: "country",
    cell: ({ row }) => row.original.country?.title ?? "-",
  },
   {
    header: "Company",
    accessorKey: "company",
    cell: ({ row }) => row.original.company?.title ?? "-",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionsBtns
        record={row.original}
        useStore={useContactStore}
      />
    ),
  },
];