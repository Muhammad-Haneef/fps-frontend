import { Skeleton } from "@/components/ui/skeleton";

export default function DataTableSkeleton({ columns = 5, rows = 10, hasHeader = true, }) {
  return (
    <div className="rounded-md border">
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="grid items-center gap-4 p-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, col) => (
              <Skeleton key={col} className="h-5 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}