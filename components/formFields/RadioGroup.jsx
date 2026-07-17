"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import Radio from "./Radio";

/**
 * RadioGroup — a set of mutually exclusive options.
 *
 * `options`: [{ value, label, description, disabled, icon }]
 *
 * Features:
 * - Two visual variants: "list" (compact) and "card" (bordered, selectable cards —
 *   great for plan pickers, shipping method choices, etc.)
 * - Horizontal or vertical layout
 * - Per-option description and disabled state
 * - Full keyboard support via native radio semantics (arrow keys move selection)
 */
export default function RadioGroup({
  id,
  name,
  label,
  description,
  error,
  required,
  disabled,
  options = [],
  value,
  defaultValue,
  onChange,
  variant = "list", // "list" | "card"
  orientation = "vertical", // "vertical" | "horizontal"
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const groupName = name || fieldId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div
        role="radiogroup"
        aria-labelledby={label ? fieldId : undefined}
        className={cn("flex gap-3", orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col")}
      >
        {options.map((opt) => {
          const selected = internalValue === opt.value;
          if (variant === "card") {
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all duration-150",
                  selected ? "border-brand-500 bg-brand-50/50" : "border-neutral-200 hover:border-neutral-300",
                  (disabled || opt.disabled) && "opacity-60 cursor-not-allowed"
                )}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={opt.value}
                  checked={selected}
                  disabled={disabled || opt.disabled}
                  onChange={() => setInternalValue(opt.value)}
                  className="sr-only"
                />
                {opt.icon && <span className="text-neutral-500 shrink-0 mt-0.5">{opt.icon}</span>}
                <span className="flex-1">
                  <span className="text-sm font-medium text-neutral-900">{opt.label}</span>
                  {opt.description && <span className="block text-xs text-neutral-500 mt-0.5">{opt.description}</span>}
                </span>
                <span
                  className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    selected ? "border-brand-500" : "border-neutral-300"
                  )}
                >
                  {selected && <span className="size-2 rounded-full bg-brand-500" />}
                </span>
              </label>
            );
          }
          return (
            <Radio
              key={opt.value}
              name={groupName}
              value={opt.value}
              checked={selected}
              disabled={disabled || opt.disabled}
              label={opt.label}
              description={opt.description}
              size={size}
              onChange={() => setInternalValue(opt.value)}
            />
          );
        })}
      </div>
    </FieldWrapper>
  );
}
