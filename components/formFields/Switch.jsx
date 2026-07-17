"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./TextInput";

/**
 * Switch — on/off toggle, for settings-style boolean fields.
 *
 * Features:
 * - Label on left or right (`labelPosition`)
 * - Loading state (e.g. while an API call persists the toggle) that disables
 *   interaction and shows a spinner in the thumb
 * - Size variants
 */
export default function Switch({
  id,
  name,
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  disabled,
  loading = false,
  size = "md",
  labelPosition = "right", // "left" | "right"
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const dims = {
    sm: { track: "w-8 h-4.5", thumb: "size-3.5", translate: "translate-x-3.5" },
    md: { track: "w-10 h-5.5", thumb: "size-4.5", translate: "translate-x-4.5" },
    lg: { track: "w-12 h-6.5", thumb: "size-5.5", translate: "translate-x-5.5" },
  }[size];

  const control = (
    <span className="relative inline-flex shrink-0">
      <input
        id={fieldId}
        type="checkbox"
        name={name}
        role="switch"
        aria-checked={checked}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled || loading}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          dims.track,
          "rounded-full bg-neutral-300 transition-colors duration-200 flex items-center px-0.5",
          "peer-checked:bg-brand-500 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100",
          (disabled || loading) && "opacity-60 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            dims.thumb,
            "rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center",
            checked && dims.translate
          )}
        >
          {loading && <Spinner size="sm" className="size-3 text-neutral-400" />}
        </span>
      </span>
    </span>
  );

  if (!label && !description) {
    return <label htmlFor={fieldId} className={cn("cursor-pointer", (disabled || loading) && "cursor-not-allowed", className)}>{control}</label>;
  }

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        "flex items-center gap-3 cursor-pointer",
        labelPosition === "left" && "flex-row-reverse justify-end",
        (disabled || loading) && "cursor-not-allowed opacity-80",
        className
      )}
    >
      {control}
      <span className="flex flex-col">
        {label && <span className="text-sm font-medium text-neutral-800">{label}</span>}
        {description && <span className="text-xs text-neutral-500 mt-0.5">{description}</span>}
      </span>
    </label>
  );
}
