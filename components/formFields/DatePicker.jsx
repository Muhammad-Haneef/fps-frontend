"use client";

import { useEffect, useId, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { formatDate, parseDateInput, isBeforeDay, isAfterDay } from "@/lib/dateUtils";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import Calendar from "./Calendar";
import FloatingPanel from "./FloatingPanel";

/**
 * DatePicker — text field + calendar popover, the standard single-date picker.
 *
 * Features:
 * - Type a date directly (validated against `format`) OR pick from the calendar
 * - min/max bounds, custom `isDateDisabled`
 * - Quick-pick shortcuts (Today, Clear) in the popover footer
 * - Clearable, error state if typed text doesn't parse to a valid/allowed date
 */
export default function DatePicker({
  id,
  label,
  description,
  error: externalError,
  required,
  disabled,
  placeholder,
  value,
  defaultValue = null,
  onChange,
  format = "MM/DD/YYYY",
  minDate,
  maxDate,
  isDateDisabled,
  clearable = true,
  size = "md",
  className,
  inputClassName,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState(selected ? formatDate(selected, format) : "");
  const [localError, setLocalError] = useState("");
  const wrapperRef = useClickOutside(() => setOpen(false));

  useEffect(() => {
    setInputText(selected ? formatDate(selected, format) : "");
  }, [selected, format]);

  function commitTyped(text) {
    if (!text) {
      setSelected(null);
      setLocalError("");
      return;
    }
    const parsed = parseDateInput(text, format);
    if (!parsed) {
      setLocalError("Invalid date");
      return;
    }
    if (minDate && isBeforeDay(parsed, minDate)) {
      setLocalError(`Date must be after ${formatDate(minDate, format)}`);
      return;
    }
    if (maxDate && isAfterDay(parsed, maxDate)) {
      setLocalError(`Date must be before ${formatDate(maxDate, format)}`);
      return;
    }
    setLocalError("");
    setSelected(parsed);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={externalError || localError} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <input
            id={fieldId}
            type="text"
            value={inputText}
            placeholder={placeholder || format}
            disabled={disabled}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => commitTyped(inputText)}
            onKeyDown={(e) => e.key === "Enter" && commitTyped(inputText)}
            className={cn(fieldBoxClasses({ size, error: externalError || localError, disabled, hasLeftIcon: true, hasRightIcon: clearable }), inputClassName)}
          />
          <span className={cn("pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400", sizeStyles[size].icon)}>
            <CalendarIcon />
          </span>
          {clearable && selected && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                setSelected(null);
                setInputText("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 rounded-full p-0.5 hover:bg-neutral-100"
            >
              <XIcon className={sizeStyles[size].icon} />
            </button>
          )}
        </div>

        {open && !disabled && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg p-3">
            <Calendar
              value={selected}
              onChange={(d) => {
                setSelected(d);
                setOpen(false);
              }}
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isDateDisabled}
            />
            <div className="flex justify-between mt-2 pt-2 border-t border-neutral-100">
              <button type="button" onClick={() => setSelected(new Date())} className="text-xs text-brand-600 hover:underline">Today</button>
              <button type="button" onClick={() => { setSelected(null); setOpen(false); }} className="text-xs text-neutral-400 hover:underline">Clear</button>
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2ZM3.5 8.5v6.75c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8.5h-13Z" clipRule="evenodd" />
    </svg>
  );
}
function XIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>;
}
