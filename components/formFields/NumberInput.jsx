"use client";

import { useId } from "react";
import { cn, sizeStyles, clamp } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * NumberInput — integer/general numeric field.
 *
 * Features:
 * - Increment/decrement stepper buttons + full keyboard support (↑ ↓, Shift = x10)
 * - Min/max clamping, step size
 * - Prefix/suffix units (e.g. "kg", "km")
 * - Scroll-to-change disabled by default (prevents accidental edits while scrolling page)
 */
export default function NumberInput({
  id,
  label,
  description,
  error,
  success,
  required,
  disabled,
  readOnly,
  size = "md",
  value,
  defaultValue = "",
  onChange,
  min,
  max,
  step = 1,
  bigStep = 10,
  unit,
  showStepper = true,
  placeholder,
  className,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });

  function commit(n) {
    const clamped = clamp(n, min, max);
    setInternalValue(Number.isFinite(clamped) ? clamped : "");
  }

  function handleChange(e) {
    const raw = e.target.value;
    if (raw === "" || raw === "-") {
      setInternalValue(raw);
      return;
    }
    if (/^-?\d+$/.test(raw)) commit(Number(raw));
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      commit((Number(internalValue) || 0) + (e.shiftKey ? bigStep : step));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      commit((Number(internalValue) || 0) - (e.shiftKey ? bigStep : step));
    }
  }

  const atMax = typeof max === "number" && Number(internalValue) >= max;
  const atMin = typeof min === "number" && Number(internalValue) <= min;

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} success={success} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative flex items-stretch">
        <input
          id={fieldId}
          type="text"
          inputMode="numeric"
          value={internalValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={Boolean(error)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => internalValue !== "" && commit(Number(internalValue))}
          className={cn(
            fieldBoxClasses({ size, error, success, disabled, hasRightIcon: showStepper || Boolean(unit) }),
            "text-right tabular-nums",
            showStepper && "rounded-r-none"
          )}
          {...rest}
        />
        {unit && !showStepper && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none">{unit}</span>
        )}

        {showStepper && (
          <div className="flex flex-col rounded-r-[var(--radius-field)] border border-l-0 border-neutral-300 overflow-hidden shrink-0">
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled || atMax}
              onClick={() => commit((Number(internalValue) || 0) + step)}
              className="flex-1 px-2 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent border-b border-neutral-200 transition-colors"
              aria-label="Increment"
            >
              <ChevronUp className="size-3" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled || atMin}
              onClick={() => commit((Number(internalValue) || 0) - step)}
              className="flex-1 px-2 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Decrement"
            >
              <ChevronDown className="size-3" />
            </button>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}

function ChevronUp({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M9.47 5.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 1 1-1.06 1.06L10 7.06l-3.97 3.97a.75.75 0 0 1-1.06-1.06l4.5-4.5Z" clipRule="evenodd" /></svg>;
}
function ChevronDown({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" /></svg>;
}
