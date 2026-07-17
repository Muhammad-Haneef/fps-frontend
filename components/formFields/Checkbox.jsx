"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Checkbox — custom-styled checkbox.
 *
 * Features:
 * - Indeterminate visual state (`indeterminate` prop) — for "select all" parents
 * - Optional label + description, click-anywhere-on-row toggling
 * - Card variant for prominent toggles (e.g. add-on selection)
 */
export default function Checkbox({
  id,
  name,
  value,
  checked,
  defaultChecked,
  indeterminate = false,
  onChange,
  label,
  description,
  disabled,
  size = "md",
  variant = "default", // "default" | "card"
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  const box = { sm: "size-4", md: "size-5", lg: "size-6" }[size];

  const boxEl = (
    <span className="relative flex items-center justify-center shrink-0">
      <input
        ref={inputRef}
        id={fieldId}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked, value)}
        className="peer sr-only"
      />
      <span
        className={cn(
          box,
          "rounded-md border-2 border-neutral-300 bg-neutral-0 flex items-center justify-center transition-all duration-150",
          "peer-checked:bg-brand-500 peer-checked:border-brand-500",
          "peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100",
          "peer-hover:border-neutral-400",
          (indeterminate) && "bg-brand-500 border-brand-500"
        )}
      >
        {indeterminate && !checked ? (
          <svg viewBox="0 0 12 12" fill="none" className="size-2.5">
            <path d="M2.5 6h7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" fill="none" className="size-2.5 opacity-0 peer-checked:opacity-100 scale-75 peer-checked:scale-100 transition-all">
            <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </span>
  );

  if (variant === "card") {
    return (
      <label
        htmlFor={fieldId}
        className={cn(
          "flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all duration-150",
          checked ? "border-brand-500 bg-brand-50/50" : "border-neutral-200 hover:border-neutral-300",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <span className="flex-1">
          {label && <span className="block text-sm font-medium text-neutral-900">{label}</span>}
          {description && <span className="block text-xs text-neutral-500 mt-0.5">{description}</span>}
        </span>
        {boxEl}
      </label>
    );
  }

  return (
    <label htmlFor={fieldId} className={cn("flex items-start gap-2.5 cursor-pointer", disabled && "cursor-not-allowed opacity-60", className)}>
      {boxEl}
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm text-neutral-800 font-medium leading-tight">{label}</span>}
          {description && <span className="text-xs text-neutral-500 mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
}
