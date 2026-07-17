"use client";

import { useId, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { formatDate, startOfWeek, endOfWeek } from "@/lib/dateUtils";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import Calendar from "./Calendar";
import FloatingPanel from "./FloatingPanel";

/**
 * WeekPicker — pick an entire calendar week (for weekly reports, sprint
 * planning, "week of" scheduling). Clicking any day selects its whole week;
 * the calendar highlights the full row instead of a single cell.
 *
 * Value shape: a Date representing any day within the selected week
 * (use startOfWeek/endOfWeek from lib/dateUtils to get the bounds).
 */
export default function WeekPicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = null,
  onChange,
  weekStartsOn = 0,
  format = "MM/DD",
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const wrapperRef = useClickOutside(() => setOpen(false));

  const display = selected
    ? `${formatDate(startOfWeek(selected, weekStartsOn), format)} – ${formatDate(endOfWeek(selected, weekStartsOn), format)}`
    : "";

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
            <WeekIcon />
          </span>
          <span className={cn("pl-6", !display && "text-neutral-400")}>{display || "Select a week"}</span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg p-3">
            <Calendar
              mode="week"
              value={selected}
              onChange={(d) => {
                setSelected(d);
                setOpen(false);
              }}
              weekStartsOn={weekStartsOn}
            />
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function WeekIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2ZM3.5 8.5v6.75c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8.5h-13Z" clipRule="evenodd" />
    </svg>
  );
}
