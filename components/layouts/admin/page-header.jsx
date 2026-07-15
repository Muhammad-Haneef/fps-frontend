"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}) {
  const pathname = usePathname();

  const pageName = pathname.split("/").filter(Boolean)[0];
  const action = pathname.split("/").filter(Boolean)[1];

  const pageTitle =
    title ??
    pageName?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight text-foreground text-shadow-sm">
          {pageTitle}{" - "}
          <span className="text-xs text-muted-foreground">{action === "add" ? "Add" : "Edit"}</span>
        </h1>

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
