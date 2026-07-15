"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import Link from "next/link";
import { SquarePen, Trash2, UndoDot, Loader2 } from "lucide-react";

import { useConfirmStore } from "@/stores/useConfirmStore";

export default function ActionsBtns({ record, useStore }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = pathname.split("/").filter(Boolean)[0];
  const queryString = searchParams.toString();

  const [loading, setLoading] = useState(false);

  const trashRecord = useStore((s) => s.trashRecord);
  const restoreRecord = useStore((s) => s.restoreRecord);
  const setRecord = useStore((s) => s.setRecord);

  const confirm = useConfirmStore((s) => s.confirm);

  const handleTrash = async () => {
    setLoading(true);
    try {
      await trashRecord(record.id);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      await restoreRecord(record.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
      ) : record?.deleted_at ? (
        <UndoDot
          className="h-4 w-4 cursor-pointer text-orange-600"
          onClick={() =>
            confirm({
              title: "Restore Record",
              message: `Are you sure you want to restore "${record.title}"?`,
              onConfirm: handleRestore,
            })
          }
        />
      ) : (
        <>
          <Link
            href={`/${moduleName}/${record.id}${
              queryString ? `?${queryString}` : ""
            }`}
          >
            <SquarePen className="h-4 w-4 cursor-pointer text-green-600" />
          </Link>

          <Trash2
            className="h-4 w-4 cursor-pointer text-red-600"
            onClick={() =>
              confirm({
                title: "Delete Record",
                message: "Are you sure you want to delete this record?",
                onConfirm: handleTrash,
              })
            }
          />
        </>
      )}
    </div>
  );
}
