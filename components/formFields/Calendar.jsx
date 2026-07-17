"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  WEEKDAY_LABELS, MONTH_LABELS,
  getMonthMatrix, isSameDay, isSameMonth, addMonths,
  isBetween, isBeforeDay, isAfterDay, startOfDay, startOfWeek, endOfWeek,
} from "@/lib/dateUtils";

/**
 * Calendar — standalone month-grid calendar. Used directly for "pick a date
 * inline" UIs, and internally by DatePicker/DateRangePicker/WeekPicker.
 *
 * Features:
 * - Month + year quick-jump header (click the month/year label to open a
 *   fast month grid instead of clicking ‹ › dozens of times)
 * - min/max date bounds, per-date disable via `isDateDisabled(date)`
 * - Range mode (`mode="range"`) with hover-preview of the in-progress range
 * - Week mode (`mode="week"`) highlights the whole week row on select
 * - Today marker, keyboard navigation (arrow keys, Enter, PageUp/Down)
 */
export default function Calendar({
  value, // Date (single) or [start, end] (range)
  onChange,
  mode = "single", // "single" | "range" | "week"
  minDate,
  maxDate,
  isDateDisabled,
  weekStartsOn = 0,
  initialMonth, // optional: seed the visible month independent of `value` (used by dual-month views)
  className,
}) {
  const initial = initialMonth || (mode === "range" ? value?.[0] || new Date() : value || new Date());
  const [viewDate, setViewDate] = useState(initial);
  const [view, setView] = useState("days"); // "days" | "months"
  const [hoverDate, setHoverDate] = useState(null);
  const [focusDate, setFocusDate] = useState(startOfDay(initial));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getMonthMatrix(year, month, weekStartsOn);
  const today = startOfDay(new Date());

  const [rangeStart, rangeEnd] = mode === "range" ? value || [null, null] : [null, null];

  function disabled(d) {
    if (minDate && isBeforeDay(d, minDate)) return true;
    if (maxDate && isAfterDay(d, maxDate)) return true;
    if (isDateDisabled?.(d)) return true;
    return false;
  }

  function handlePick(d) {
    if (disabled(d)) return;
    if (mode === "range") {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        onChange?.([startOfDay(d), null]);
      } else if (isBeforeDay(d, rangeStart)) {
        onChange?.([startOfDay(d), rangeStart]);
      } else {
        onChange?.([rangeStart, startOfDay(d)]);
      }
    } else {
      onChange?.(startOfDay(d));
    }
  }

  function handleKeyDown(e) {
    let next = focusDate;
    if (e.key === "ArrowRight") next = new Date(focusDate.setDate(focusDate.getDate() + 1));
    else if (e.key === "ArrowLeft") next = new Date(focusDate.setDate(focusDate.getDate() - 1));
    else if (e.key === "ArrowDown") next = new Date(focusDate.setDate(focusDate.getDate() + 7));
    else if (e.key === "ArrowUp") next = new Date(focusDate.setDate(focusDate.getDate() - 7));
    else if (e.key === "Enter") {
      handlePick(focusDate);
      return;
    } else if (e.key === "PageUp") next = addMonths(focusDate, -1);
    else if (e.key === "PageDown") next = addMonths(focusDate, 1);
    else return;
    e.preventDefault();
    const cloned = new Date(next);
    setFocusDate(cloned);
    setViewDate(cloned);
  }

  return (
    <div className={cn("select-none w-72", className)} onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between mb-2 px-1">
        <button type="button" onClick={() => setViewDate(addMonths(viewDate, -1))} className="size-7 flex items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-500" aria-label="Previous month">
          <ChevronIcon className="size-4 rotate-90" />
        </button>
        <button type="button" onClick={() => setView(view === "days" ? "months" : "days")} className="text-sm font-semibold text-neutral-800 hover:text-brand-600 px-2 py-1 rounded-md hover:bg-neutral-50">
          {MONTH_LABELS[month]} {year}
        </button>
        <button type="button" onClick={() => setViewDate(addMonths(viewDate, 1))} className="size-7 flex items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-500" aria-label="Next month">
          <ChevronIcon className="size-4 -rotate-90" />
        </button>
      </div>

      {view === "months" && (
        <div className="grid grid-cols-3 gap-1.5 p-1">
          {MONTH_LABELS.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setViewDate(new Date(year, i, 1));
                setView("days");
              }}
              className={cn("h-10 rounded-md text-sm hover:bg-brand-50", i === month && "bg-brand-500 text-white hover:bg-brand-500")}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {view === "days" && (
        <>
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAY_LABELS.map((w) => (
              <div key={w} className="h-7 flex items-center justify-center text-xs font-medium text-neutral-400">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5" role="grid">
            {days.map((d) => {
              const inMonth = isSameMonth(d, viewDate);
              const isToday = isSameDay(d, today);
              const isDisabled = disabled(d);
              const isFocused = isSameDay(d, focusDate);

              let isSelected = false;
              let inRange = false;
              let isRangeStart = false;
              let isRangeEnd = false;
              let inSelectedWeek = false;

              if (mode === "range") {
                isRangeStart = rangeStart && isSameDay(d, rangeStart);
                isRangeEnd = rangeEnd && isSameDay(d, rangeEnd);
                const previewEnd = rangeEnd || hoverDate;
                inRange = rangeStart && previewEnd && !isBeforeDay(previewEnd, rangeStart) && isBetween(d, rangeStart, previewEnd);
                isSelected = isRangeStart || isRangeEnd;
              } else if (mode === "week") {
                if (value) {
                  const [wStart, wEnd] = [startOfWeek(value, weekStartsOn), endOfWeek(value, weekStartsOn)];
                  inSelectedWeek = isBetween(d, wStart, wEnd);
                }
                isSelected = inSelectedWeek;
              } else {
                isSelected = value && isSameDay(d, value);
              }

              return (
                <div key={d.toISOString()} className="relative flex items-center justify-center h-9">
                  {(inRange || inSelectedWeek) && <span className="absolute inset-y-0 left-0 right-0 bg-brand-50" />}
                  <button
                    type="button"
                    tabIndex={isFocused ? 0 : -1}
                    disabled={isDisabled}
                    onClick={() => handlePick(d)}
                    onMouseEnter={() => setHoverDate(d)}
                    className={cn(
                      "relative z-10 size-8 rounded-full text-sm flex items-center justify-center transition-colors",
                      !inMonth && "text-neutral-300",
                      inMonth && !isDisabled && "text-neutral-700 hover:bg-neutral-100",
                      isToday && !isSelected && "font-semibold text-brand-600",
                      (isSelected || isRangeStart || isRangeEnd) && !inSelectedWeek && "bg-brand-500 text-white hover:bg-brand-500",
                      inSelectedWeek && "bg-transparent text-neutral-900 font-medium",
                      isDisabled && "text-neutral-300 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {d.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function ChevronIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" /></svg>;
}
