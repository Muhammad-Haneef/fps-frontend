"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Radio — a single radio input with custom styling (usually used via RadioGroup,
 * but works standalone for one-off yes/no style choices too).
 */
export default function Radio({
  id,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  disabled,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const dot = { sm: "size-4", md: "size-5", lg: "size-6" }[size];
  const dotInner = { sm: "size-1.5", md: "size-2", lg: "size-2.5" }[size];

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        "flex items-start gap-2.5 cursor-pointer group",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <span className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          id={fieldId}
          type="radio"
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
            dot,
            "rounded-full border-2 border-neutral-300 bg-neutral-0 transition-all duration-150",
            "peer-checked:border-brand-500 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100",
            "peer-hover:border-neutral-400 peer-checked:peer-hover:border-brand-600"
          )}
        />
        <span
          className={cn(
            dotInner,
            "absolute rounded-full bg-brand-500 scale-0 peer-checked:scale-100 transition-transform duration-150"
          )}
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm text-neutral-800 font-medium leading-tight">{label}</span>}
          {description && <span className="text-xs text-neutral-500 mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
}
