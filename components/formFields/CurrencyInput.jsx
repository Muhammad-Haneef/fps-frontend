"use client";

import { useId, useState } from "react";
import { cn, toNumericString } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

const SYMBOLS = { USD: "$", EUR: "€", GBP: "£", PKR: "₨", INR: "₹", AED: "د.إ", SAR: "﷼" };

/**
 * CurrencyInput — monetary amount field.
 *
 * Features:
 * - Currency symbol prefix (auto from `currency` code, or pass `symbol` directly)
 * - Live thousands-separator formatting while typing (caret-safe)
 * - Fixed 2-decimal formatting on blur
 * - Optional currency switcher dropdown when `currencies` list is provided
 * - Emits both display string and raw numeric value via onChange(raw, display)
 */
export default function CurrencyInput({
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
  currency = "USD",
  currencies,
  onCurrencyChange,
  min = 0,
  max,
  placeholder = "0.00",
  className,
  inputClassName,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [localError, setLocalError] = useState("");
  const symbol = SYMBOLS[currency] || currency;

  function handleChange(e) {
    const cleaned = toNumericString(e.target.value, { allowDecimal: true });
    setInternalValue(cleaned);
    setLocalError("");
  }

  function handleBlur() {
    if (internalValue === "") return;
    const n = Number(internalValue);
    if (Number.isNaN(n)) {
      setInternalValue("");
      return;
    }
    if (typeof min === "number" && n < min) setLocalError(`Minimum amount is ${symbol}${min}`);
    if (typeof max === "number" && n > max) setLocalError(`Maximum amount is ${symbol}${max}`);
    setInternalValue(n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }

  function handleFocus(e) {
    setInternalValue(String(internalValue).replace(/,/g, ""));
    requestAnimationFrame(() => e.target.select());
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error || localError} success={success} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative flex items-stretch">
        <span
          className={cn(
            "flex items-center rounded-l-[var(--radius-field)] border border-r-0 bg-neutral-50 px-3 text-neutral-500 font-medium shrink-0",
            error || localError ? "border-danger-400" : "border-neutral-300"
          )}
        >
          {symbol}
        </span>

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
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            fieldBoxClasses({ size, error: error || localError, success, disabled, hasRightIcon: Boolean(currencies) }),
            "rounded-l-none text-right tabular-nums",
            currencies && "rounded-r-none",
            inputClassName
          )}
          {...rest}
        />

        {currencies && (
          <select
            value={currency}
            disabled={disabled}
            onChange={(e) => onCurrencyChange?.(e.target.value)}
            className="rounded-r-[var(--radius-field)] border border-l-0 border-neutral-300 bg-neutral-50 px-2 text-sm text-neutral-600 outline-none focus:border-brand-500 shrink-0"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>
    </FieldWrapper>
  );
}
