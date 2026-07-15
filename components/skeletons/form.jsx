"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton({
  rows = 8,
  columns = 2,
  hasHeader = false,
}) {
  return (
    <div className="space-y-6">
      {hasHeader && (
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
      )}

      <div className="rounded-lg border bg-card p-6">
        <div
          className={`grid gap-6 ${
            columns === 1
              ? "grid-cols-1"
              : columns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}