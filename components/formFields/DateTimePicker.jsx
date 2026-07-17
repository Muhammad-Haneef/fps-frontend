"use client";

import { useEffect, useId, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { formatDate, isBeforeDay, isAfterDay } from "@/lib/dateUtils";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import Calendar from "./Calendar";
import FloatingPanel from "./FloatingPanel";

/**
 * DateTimePicker — pick a full date + time in one popover (calendar on the
 * left, hour/minute columns on the right — like scheduling a calendar event).
 *
 * Value shape: a JS Date with both date and time set.
 */
export default function DateTimePicker({
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
  hour12 = true,
  minuteStep = 5,
  format = "MM/DD/YYYY",
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const wrapperRef = useClickOutside(() => setOpen(false));

  const hours = hour12 ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  function updateDatePart(d) {
    const base = selected ? new Date(selected) : new Date();
    base.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
    setSelected(base);
  }

  function updateTimePart(patch) {
    const base = selected ? new Date(selected) : new Date();
    if (patch.hour24 !== undefined) base.setHours(patch.hour24);
    if (patch.minute !== undefined) base.setMinutes(patch.minute);
    setSelected(new Date(base));
  }

  function get12Hour(d) {
    const h = d.getHours() % 12;
    return h === 0 ? 12 : h;
  }
  function getPeriod(d) {
    return d.getHours() >= 12 ? "PM" : "AM";
  }
  function setPeriod(p) {
    const base = selected ? new Date(selected) : new Date();
    const current = base.getHours();
    const isPM = current >= 12;
    if (p === "PM" && !isPM) base.setHours(current + 12);
    if (p === "AM" && isPM) base.setHours(current - 12);
    setSelected(new Date(base));
  }
  function setHour12(h) {
    const base = selected ? new Date(selected) : new Date();
    const isPM = base.getHours() >= 12;
    let hour24 = h % 12;
    if (isPM) hour24 += 12;
    updateTimePart({ hour24 });
  }

  const display = selected
    ? `${formatDate(selected, format)} · ${hour12 ? get12Hour(selected) : selected.getHours()}:${String(selected.getMinutes()).padStart(2, "0")}${hour12 ? " " + getPeriod(selected) : ""}`
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
            <CalendarClockIcon />
          </span>
          <span className={cn("pl-6 truncate", !selected && "text-neutral-400")}>{display || "Select date & time"}</span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg p-3 flex gap-3">
            <Calendar value={selected} onChange={updateDatePart} minDate={minDate} maxDate={maxDate} />
            <div className="flex gap-1 border-l border-neutral-100 pl-3">
              <TimeColumn values={hours} selected={selected ? (hour12 ? get12Hour(selected) : selected.getHours()) : null} onSelect={(h) => (hour12 ? setHour12(h) : updateTimePart({ hour24: h }))} />
              <TimeColumn values={minutes} selected={selected ? selected.getMinutes() : null} onSelect={(m) => updateTimePart({ minute: m })} pad />
              {hour12 && (
                <div className="flex flex-col gap-1 justify-center">
                  {["AM", "PM"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={cn("h-9 w-12 rounded-md text-sm font-medium", selected && getPeriod(selected) === p ? "bg-brand-500 text-white" : "hover:bg-neutral-100 text-neutral-600")}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function TimeColumn({ values, selected, onSelect, pad }) {
  return (
    <div className="h-64 w-12 overflow-y-auto flex flex-col gap-0.5 pr-1">
      {values.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onSelect(v)}
          className={cn("h-8 rounded-md text-sm tabular-nums shrink-0", selected === v ? "bg-brand-500 text-white font-medium" : "hover:bg-neutral-100 text-neutral-600")}
        >
          {pad ? String(v).padStart(2, "0") : v}
        </button>
      ))}
    </div>
  );
}

function CalendarClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v2.878a5.5 5.5 0 1 0-7.665 7.666c-.198.132-.407.24-.585.24H4.75A2.75 2.75 0 0 1 2 14.75v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2ZM3.5 8.5v6.25c0 .69.56 1.25 1.25 1.25h4.756A5.478 5.478 0 0 1 9 13.5a5.5 5.5 0 0 1 8-4.9V8.5h-13.5Z" clipRule="evenodd" />
      <path d="M13.5 11a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm.4 1.2v1.5l1.1.65a.4.4 0 1 1-.4.7l-1.3-.75a.4.4 0 0 1-.2-.35v-1.75a.4.4 0 0 1 .8 0Z" />
    </svg>
  );
}
