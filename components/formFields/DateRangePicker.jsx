"use client";

import { useId, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { formatDate, addDays, addMonths, startOfDay } from "@/lib/dateUtils";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import Calendar from "./Calendar";
import FloatingPanel from "./FloatingPanel";

const PRESETS = [
  { label: "Today", getRange: () => [startOfDay(new Date()), startOfDay(new Date())] },
  { label: "Last 7 days", getRange: () => [addDays(startOfDay(new Date()), -6), startOfDay(new Date())] },
  { label: "Last 30 days", getRange: () => [addDays(startOfDay(new Date()), -29), startOfDay(new Date())] },
  { label: "This month", getRange: () => { const d = new Date(); return [new Date(d.getFullYear(), d.getMonth(), 1), startOfDay(new Date())]; } },
];

/**
 * DateRangePicker — pick a start and end date via a dual-month calendar with
 * quick presets (Today, Last 7 days, etc.) — the classic analytics dashboard
 * date-range control.
 *
 * Value shape: [startDate, endDate] (either may be null while mid-selection).
 */
export default function DateRangePicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = [null, null],
  onChange,
  minDate,
  maxDate,
  format = "MM/DD/YYYY",
  showPresets = true,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [range, setRange] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const wrapperRef = useClickOutside(() => setOpen(false));
  const [start, end] = range || [null, null];
  const [rightMonth, setRightMonth] = useState(addMonths(start || new Date(), 1));

  const display = start && end ? `${formatDate(start, format)} – ${formatDate(end, format)}` : start ? `${formatDate(start, format)} – ...` : "";

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error, disabled, hasLeftIcon: true }), "flex items-center text-left")}
        >
          <span className={cn("absolute left-2.5 text-neutral-400", sizeStyles[size].icon)}>
            <RangeIcon />
          </span>
          <span className={cn("pl-6 truncate", !display && "text-neutral-400")}>{display || "Select date range"}</span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg p-3 flex gap-3">
            {showPresets && (
              <div className="flex flex-col gap-0.5 border-r border-neutral-100 pr-3 w-32 shrink-0">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setRange(p.getRange())}
                    className="text-left text-xs px-2 py-1.5 rounded-md hover:bg-neutral-100 text-neutral-600"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Calendar
                mode="range"
                value={range}
                onChange={setRange}
                minDate={minDate}
                maxDate={maxDate}
                initialMonth={start || new Date()}
              />
              <div className="border-l border-neutral-100 pl-3">
                <Calendar
                  mode="range"
                  value={range}
                  onChange={setRange}
                  minDate={minDate}
                  maxDate={maxDate}
                  initialMonth={rightMonth}
                />
              </div>
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function RangeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2ZM3.5 8.5v6.75c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8.5h-13Z" clipRule="evenodd" />
    </svg>
  );
}
