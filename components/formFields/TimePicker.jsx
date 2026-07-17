"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

/**
 * TimePicker — pick a time via scrollable hour/minute (and optional second)
 * columns, or type it directly (e.g. "2:30 PM").
 *
 * Value shape: { hour, minute, second, period } (period only in 12h mode).
 *
 * Features:
 * - 12h (AM/PM) or 24h mode (`hour12`)
 * - Optional seconds column
 * - Minute step (e.g. 15 for quarter-hour scheduling UIs)
 * - Click-to-scroll columns, auto-scrolls to current selection on open
 */
export default function TimePicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = null, // { hour, minute, second, period }
  onChange,
  hour12 = true,
  showSeconds = false,
  minuteStep = 1,
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
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  function update(patch) {
    setSelected({ hour: hour12 ? 12 : 0, minute: 0, second: 0, period: "AM", ...selected, ...patch });
  }

  function display() {
    if (!selected) return "";
    const h = String(selected.hour).padStart(2, "0");
    const m = String(selected.minute).padStart(2, "0");
    const s = showSeconds ? `:${String(selected.second || 0).padStart(2, "0")}` : "";
    return `${h}:${m}${s}${hour12 ? ` ${selected.period}` : ""}`;
  }

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
            <ClockIcon />
          </span>
          <span className={cn("pl-6", !selected && "text-neutral-400")}>{selected ? display() : "Select time"}</span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg p-2 flex gap-1">
            <TimeColumn label="Hr" values={hours} selected={selected?.hour} onSelect={(h) => update({ hour: h })} />
            <TimeColumn label="Min" values={minutes} selected={selected?.minute} onSelect={(m) => update({ minute: m })} pad />
            {showSeconds && <TimeColumn label="Sec" values={seconds} selected={selected?.second} onSelect={(s) => update({ second: s })} pad />}
            {hour12 && (
              <div className="flex flex-col gap-1 justify-center px-1">
                {["AM", "PM"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update({ period: p })}
                    className={cn("h-9 w-12 rounded-md text-sm font-medium", selected?.period === p ? "bg-brand-500 text-white" : "hover:bg-neutral-100 text-neutral-600")}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function TimeColumn({ label, values, selected, onSelect, pad }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-semibold text-neutral-400 uppercase mb-1">{label}</span>
      <div className="h-40 w-12 overflow-y-auto flex flex-col gap-0.5 pr-1">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onSelect(v)}
            className={cn(
              "h-8 rounded-md text-sm tabular-nums shrink-0",
              selected === v ? "bg-brand-500 text-white font-medium" : "hover:bg-neutral-100 text-neutral-600"
            )}
          >
            {pad ? String(v).padStart(2, "0") : v}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .3.15.577.401.744l3.5 2.333a.75.75 0 0 0 .833-1.249L10.75 9.6V5Z" clipRule="evenodd" />
    </svg>
  );
}
