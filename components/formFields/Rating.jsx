"use client";

import { useId, useRef, useState } from "react";
import { cn, clamp } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

const ICON_PATHS = {
  star: "M10 1.5l2.47 5.51 6.03.62-4.53 4.06 1.28 5.93L10 14.77l-5.25 2.85 1.28-5.93L1.5 7.63l6.03-.62L10 1.5z",
  heart:
    "M10 17.25l-.9-.82C4.9 12.6 2 9.98 2 6.75 2 4.13 4.05 2 6.6 2c1.43 0 2.8.68 3.4 1.75C10.6 2.68 11.97 2 13.4 2 15.95 2 18 4.13 18 6.75c0 3.23-2.9 5.85-7.1 9.69l-.9.81z",
  thumb:
    "M2 9h3v9H2V9zm5.5 9h7.2c.8 0 1.5-.55 1.7-1.33l1.5-6.5c.25-1.1-.6-2.17-1.7-2.17H12l.5-3.2c.1-.65-.12-1.3-.6-1.75a1.6 1.6 0 0 0-2.3.1L6.5 6.9c-.5.55-.8 1.3-.8 2.1v7.5c0 .82.67 1.5 1.5 1.5H7.5z",
};

/**
 * Rating — generic rating control built around an SVG "fill percentage"
 * trick: each icon renders a gray outline layer plus a colored layer
 * clipped to a width percentage, so half (or any fractional) values are
 * just CSS, no extra icon assets.
 *
 * Features:
 * - Pluggable icon (`icon="star" | "heart" | "thumb"` or a custom `d` path)
 * - `allowHalf` for 0.5-precision values, otherwise whole numbers only
 * - Hover preview, keyboard support (arrow keys), read-only display mode
 * - `StarRating` is a thin preset over this component
 */
export default function Rating({
  id,
  label,
  description,
  error,
  required,
  disabled,
  readOnly = false,
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  allowHalf = false,
  icon = "star",
  iconPath,
  color = "text-amber-400",
  emptyColor = "text-neutral-300",
  size = "md",
  showValue = false,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange });
  const [hover, setHover] = useState(null);
  const groupRef = useRef(null);
  const interactive = !disabled && !readOnly;
  const display = hover ?? current;
  const path = iconPath || ICON_PATHS[icon] || ICON_PATHS.star;

  const dims = { sm: "size-4", md: "size-6", lg: "size-8" }[size];
  const gap = { sm: "gap-0.5", md: "gap-1", lg: "gap-1.5" }[size];

  function valueFromPointer(e, index) {
    if (!allowHalf) return index;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return x < rect.width / 2 ? index - 0.5 : index;
  }

  function handleKeyDown(e) {
    if (!interactive) return;
    const step = allowHalf ? 0.5 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setCurrent(clamp((current || 0) + step, 0, max));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setCurrent(clamp((current || 0) - step, 0, max));
    } else if (e.key === "Home") {
      e.preventDefault();
      setCurrent(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setCurrent(max);
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="flex items-center gap-2">
        <div
          ref={groupRef}
          id={fieldId}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-disabled={disabled}
          aria-readonly={readOnly}
          tabIndex={interactive ? 0 : -1}
          onKeyDown={handleKeyDown}
          onMouseLeave={() => interactive && setHover(null)}
          className={cn("inline-flex outline-none rounded-md", gap, interactive ? "cursor-pointer" : "cursor-default", "focus-visible:ring-4 focus-visible:ring-brand-100")}
        >
          {Array.from({ length: max }, (_, i) => i + 1).map((index) => {
            const fillPercent = clamp((display - (index - 1)) * 100, 0, 100);
            return (
              <span
                key={index}
                className={cn("relative", dims)}
                onMouseMove={(e) => interactive && setHover(valueFromPointer(e, index))}
                onClick={(e) => interactive && setCurrent(valueFromPointer(e, index))}
              >
                <svg viewBox="0 0 20 19" className={cn(dims, emptyColor, "block")} fill="currentColor">
                  <path d={path} />
                </svg>
                <span className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${fillPercent}%` }}>
                  <svg viewBox="0 0 20 19" className={cn(dims, color, "block")} fill="currentColor">
                    <path d={path} />
                  </svg>
                </span>
              </span>
            );
          })}
        </div>
        {showValue && (
          <span className="text-sm text-neutral-500 tabular-nums">
            {display} / {max}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}
