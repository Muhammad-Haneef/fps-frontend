"use client";

import { useId } from "react";
import { cn, clamp } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * PercentageInput — 0-100% field with an inline progress bar for at-a-glance feedback.
 *
 * Features:
 * - Auto-clamps to [min, max] (default 0-100), supports decimals via `precision`
 * - Live mini progress bar under the field reflecting the current value
 * - "%" suffix baked in
 */
export default function PercentageInput({
  id,
  label,
  description,
  error,
  success,
  required,
  disabled,
  size = "md",
  value,
  defaultValue = "",
  onChange,
  min = 0,
  max = 100,
  precision = 0,
  showBar = true,
  placeholder = "0",
  className,
  inputClassName,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });

  function handleChange(e) {
    let v = e.target.value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    setInternalValue(v);
  }

  function handleBlur() {
    if (internalValue === "") return;
    const n = clamp(Number(internalValue), min, max);
    setInternalValue(Number.isFinite(n) ? Number(n.toFixed(precision)) : "");
  }

  const numeric = Number(internalValue) || 0;
  const barPct = clamp(((numeric - min) / (max - min)) * 100, 0, 100);

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} success={success} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative">
        <input
          id={fieldId}
          type="text"
          inputMode="decimal"
          value={internalValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(fieldBoxClasses({ size, error, success, disabled, hasRightIcon: true }), "text-right tabular-nums", inputClassName)}
          {...rest}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none">%</span>
      </div>
      {showBar && (
        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300 ease-out"
            style={{ width: `${barPct}%` }}
          />
        </div>
      )}
    </FieldWrapper>
  );
}
