"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";

/**
 * SegmentedControl — iOS-style segmented button group for a small set of
 * mutually-exclusive options (view toggles, billing period, etc.)
 *
 * Features:
 * - Sliding highlight indicator that animates to the active segment
 * - Optional icons per segment, full-width or inline sizing
 * - Keyboard support: arrow keys move selection when a segment has focus
 */
export default function SegmentedControl({
  id,
  options = [], // [{ value, label, icon, disabled }]
  value,
  defaultValue,
  onChange,
  fullWidth = false,
  size = "md",
  disabled,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue: defaultValue ?? options[0]?.value, onChange });
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const sizeClass = { sm: "h-8 text-xs px-2.5", md: "h-10 text-sm px-3.5", lg: "h-12 text-base px-4" }[size];

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === selected);
    const el = containerRef.current?.children?.[idx];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [selected, options]);

  function handleKeyDown(e, idx) {
    if (e.key === "ArrowRight") {
      const next = options[(idx + 1) % options.length];
      if (next && !next.disabled) setSelected(next.value);
    } else if (e.key === "ArrowLeft") {
      const prev = options[(idx - 1 + options.length) % options.length];
      if (prev && !prev.disabled) setSelected(prev.value);
    }
  }

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      id={fieldId}
      className={cn(
        "relative inline-flex p-1 rounded-[var(--radius-field)] bg-neutral-100 gap-0.5",
        fullWidth && "flex w-full",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      <span
        className="absolute top-1 bottom-1 rounded-[calc(var(--radius-field)-2px)] bg-neutral-0 shadow-sm transition-all duration-250 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
        aria-hidden="true"
      />
      {options.map((opt, idx) => {
        const active = opt.value === selected;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={opt.disabled}
            onClick={() => setSelected(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-[calc(var(--radius-field)-2px)] font-medium transition-colors duration-200",
              sizeClass,
              fullWidth && "flex-1",
              active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700",
              opt.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {opt.icon && <span className="size-4">{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
