"use client";

import { useCallback, useId, useRef, useState } from "react";
import { cn, clamp } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

/**
 * RangeSlider — two-thumb variant of `Slider` for picking a `[low, high]`
 * range (price filters, date-free numeric ranges, etc). Thumbs can't cross;
 * dragging one past the other pushes it along instead of swapping.
 */
export default function RangeSlider({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = [25, 75],
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  minGap = 0,
  formatValue = (v) => v,
  showTooltip = true,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [range, setRange] = useControllableState({ value, defaultValue, onChange });
  const [dragThumb, setDragThumb] = useState(null); // 0 | 1 | null
  const [hoverThumb, setHoverThumb] = useState(null);
  const trackRef = useRef(null);
  const [low, high] = range;

  const track = { sm: "h-1.5", md: "h-2", lg: "h-2.5" }[size];
  const thumb = { sm: "size-4", md: "size-5", lg: "size-6" }[size];

  const lowPercent = ((clamp(low, min, max) - min) / (max - min)) * 100;
  const highPercent = ((clamp(high, min, max) - min) / (max - min)) * 100;

  const valueFromClientX = useCallback(
    (clientX) => {
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      return clamp(Number(stepped.toFixed(6)), min, max);
    },
    [min, max, step]
  );

  function startDrag(thumbIndex, e) {
    if (disabled) return;
    e.stopPropagation();
    setDragThumb(thumbIndex);
    move(e);
    function move(ev) {
      const point = ev.touches ? ev.touches[0] : ev;
      const next = valueFromClientX(point.clientX);
      setRange((prev) => {
        const [pl, ph] = prev;
        if (thumbIndex === 0) return [clamp(next, min, ph - minGap), ph];
        return [pl, clamp(next, pl + minGap, max)];
      });
    }
    function up() {
      setDragThumb(null);
      onChangeEnd?.(range);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  }

  function handleKeyDown(thumbIndex, e) {
    if (disabled) return;
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
    else if (e.key === "PageUp") delta = step * 10;
    else if (e.key === "PageDown") delta = -step * 10;
    else if (e.key === "Home") delta = thumbIndex === 0 ? min - low : min - high;
    else if (e.key === "End") delta = thumbIndex === 0 ? max - low : max - high;
    else return;
    e.preventDefault();
    setRange((prev) => {
      const [pl, ph] = prev;
      if (thumbIndex === 0) return [clamp(pl + delta, min, ph - minGap), ph];
      return [pl, clamp(ph + delta, pl + minGap, max)];
    });
  }

  const thumbClasses = (active) =>
    cn(
      thumb,
      "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-neutral-0 border-2 border-brand-500 shadow outline-none transition-transform z-10",
      "focus-visible:ring-4 focus-visible:ring-brand-100",
      !disabled && "hover:scale-110 active:scale-105 cursor-grab active:cursor-grabbing",
      disabled && "border-neutral-400 cursor-not-allowed",
      active && "z-20"
    );

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="pt-1">
        <div
          ref={trackRef}
          id={fieldId}
          className={cn("relative w-full rounded-full bg-neutral-200", track, disabled && "opacity-60")}
        >
          <div
            className={cn("absolute inset-y-0 rounded-full bg-brand-500", disabled && "bg-neutral-400")}
            style={{ left: `${lowPercent}%`, width: `${highPercent - lowPercent}%` }}
          />

          {[
            { index: 0, percent: lowPercent, val: low },
            { index: 1, percent: highPercent, val: high },
          ].map(({ index, percent, val }) => (
            <div
              key={index}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={index === 0 ? min : low}
              aria-valuemax={index === 0 ? high : max}
              aria-valuenow={val}
              aria-disabled={disabled}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onMouseEnter={() => setHoverThumb(index)}
              onMouseLeave={() => setHoverThumb((h) => (h === index ? null : h))}
              onMouseDown={(e) => startDrag(index, e)}
              onTouchStart={(e) => startDrag(index, e)}
              className={thumbClasses(dragThumb === index)}
              style={{ left: `${percent}%` }}
            >
              {showTooltip && (dragThumb === index || hoverThumb === index) && (
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-md bg-neutral-900 text-neutral-0 text-xs px-1.5 py-0.5 whitespace-nowrap pointer-events-none tabular-nums">
                  {formatValue(val)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </FieldWrapper>
  );
}
