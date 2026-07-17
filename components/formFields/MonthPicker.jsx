"use client";

import { useId, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { MONTH_LABELS, isBeforeDay, isAfterDay } from "@/lib/dateUtils";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

/**
 * MonthPicker — pick a specific month + year (billing periods, reports,
 * "member since" fields) via a 12-cell grid with year navigation.
 *
 * Value shape: { year, month } (month is 0-indexed).
 */
export default function MonthPicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = null,
  onChange,
  minDate,
  maxDate,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected?.year || new Date().getFullYear());
  const wrapperRef = useClickOutside(() => setOpen(false));

  function isDisabled(m) {
    const d = new Date(viewYear, m, 1);
    const lastOfMonth = new Date(viewYear, m + 1, 0);
    if (minDate && isBeforeDay(lastOfMonth, minDate)) return true;
    if (maxDate && isAfterDay(d, maxDate)) return true;
    return false;
  }

  const display = selected ? `${MONTH_LABELS[selected.month]} ${selected.year}` : "";

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error, disabled }), "flex items-center justify-between text-left")}
        >
          <span className={cn(!display && "text-neutral-400")}>{display || "Select month"}</span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} width={224} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => setViewYear((y) => y - 1)} className="size-7 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-500">
                <ChevronIcon className="size-4 rotate-90" />
              </button>
              <span className="text-sm font-semibold">{viewYear}</span>
              <button type="button" onClick={() => setViewYear((y) => y + 1)} className="size-7 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-500">
                <ChevronIcon className="size-4 -rotate-90" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTH_LABELS.map((m, i) => {
                const active = selected?.year === viewYear && selected?.month === i;
                const disabledCell = isDisabled(i);
                return (
                  <button
                    key={m}
                    type="button"
                    disabled={disabledCell}
                    onClick={() => {
                      setSelected({ year: viewYear, month: i });
                      setOpen(false);
                    }}
                    className={cn(
                      "h-10 rounded-md text-sm transition-colors",
                      active ? "bg-brand-500 text-white" : "hover:bg-brand-50 text-neutral-700",
                      disabledCell && "opacity-30 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {m.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function ChevronIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" /></svg>;
}
