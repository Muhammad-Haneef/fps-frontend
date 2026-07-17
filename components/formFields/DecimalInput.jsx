"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * DecimalInput — precise decimal number field (measurements, ratios, scientific values).
 *
 * Features:
 * - Enforces a fixed number of decimal places (`precision`) on blur
 * - Allows free typing while focused (doesn't fight the caret), formats on blur
 * - Optional thousands separators via `locale`
 * - Min/max validation with inline error
 */
export default function DecimalInput({
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
  precision = 2,
  min,
  max,
  locale,
  unit,
  placeholder = "0.00",
  className,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [localError, setLocalError] = useState("");

  function handleChange(e) {
    let v = e.target.value.replace(/[^0-9.\-]/g, "");
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    setInternalValue(v);
    setLocalError("");
  }

  function handleBlur() {
    if (internalValue === "" || internalValue === "-") {
      setInternalValue("");
      return;
    }
    let n = Number(internalValue);
    if (Number.isNaN(n)) {
      setInternalValue("");
      return;
    }
    if (typeof min === "number" && n < min) {
      setLocalError(`Minimum is ${min}`);
    } else if (typeof max === "number" && n > max) {
      setLocalError(`Maximum is ${max}`);
    }
    const fixed = n.toFixed(precision);
    setInternalValue(locale ? Number(fixed).toLocaleString(locale, { minimumFractionDigits: precision, maximumFractionDigits: precision }) : fixed);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error || localError} success={success} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative">
        <input
          id={fieldId}
          type="text"
          inputMode="decimal"
          value={internalValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error || localError)}
          onChange={handleChange}
          onFocus={() => setInternalValue(String(internalValue).replace(/,/g, ""))}
          onBlur={handleBlur}
          className={cn(fieldBoxClasses({ size, error: error || localError, success, disabled, hasRightIcon: Boolean(unit) }), "text-right tabular-nums")}
          {...rest}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none">{unit}</span>
        )}
      </div>
    </FieldWrapper>
  );
}
