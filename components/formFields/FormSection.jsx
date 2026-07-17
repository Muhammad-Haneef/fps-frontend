"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * FormSection — groups a chunk of a long form under a heading + description,
 * with optional collapse for progressive disclosure (e.g. "Advanced settings").
 */
export default function FormSection({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
  className,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={cn("flex flex-col gap-4 pb-6 border-b border-neutral-100 last:border-b-0 last:pb-0", className)}>
      <div
        className={cn("flex items-start justify-between gap-3", collapsible && "cursor-pointer select-none")}
        onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      >
        <div>
          {title && <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>}
          {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
        </div>
        {collapsible && (
          <button
            type="button"
            aria-expanded={open}
            className="text-neutral-400 hover:text-neutral-600 mt-0.5 shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className={cn("size-4 transition-transform", open && "rotate-180")}>
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      {(!collapsible || open) && <div className="flex flex-col gap-4">{children}</div>}
    </section>
  );
}
