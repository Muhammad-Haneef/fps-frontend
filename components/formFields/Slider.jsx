"use client";

import { useCallback, useId, useRef, useState } from "react";
import { cn, clamp } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

/**
 * Slider — single-thumb range slider. Dependency-free drag handling (same
 * pointer-tracking approach as `ColorPicker`'s hue strip), track fill,
 * optional tick `marks`, and a value tooltip that shows while dragging or
 * hovering the thumb.
 */
export default function Slider({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = 0,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  marks,
  formatValue = (v) => v,
  showTooltip = true,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange });
  const [dragging, setDragging] = useState(false);
  const [hoverThumb, setHoverThumb] = useState(false);
  const trackRef = useRef(null);

  const track = { sm: "h-1.5", md: "h-2", lg: "h-2.5" }[size];
  const thumb = { sm: "size-4", md: "size-5", lg: "size-6" }[size];

  const percent = ((clamp(current, min, max) - min) / (max - min)) * 100;

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

  function startDrag(e) {
    if (disabled) return;
    setDragging(true);
    move(e);
    function move(ev) {
      const point = ev.touches ? ev.touches[0] : ev;
      setCurrent(valueFromClientX(point.clientX));
    }
    function up() {
      setDragging(false);
      onChangeEnd?.(current);
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

  function handleKeyDown(e) {
    if (disabled) return;
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = current + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = current - step;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else if (e.key === "PageUp") next = current + step * 10;
    else if (e.key === "PageDown") next = current - step * 10;
    else return;
    e.preventDefault();
    setCurrent(clamp(next, min, max));
  }

  const showTip = showTooltip && (dragging || hoverThumb);

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className={cn("pt-1", marks && "pb-5")}>
        <div
          ref={trackRef}
          className={cn("relative w-full rounded-full bg-neutral-200", track, disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer")}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className={cn("absolute inset-y-0 left-0 rounded-full bg-brand-500", disabled && "bg-neutral-400")} style={{ width: `${percent}%` }} />

          {marks &&
            marks.map((m) => {
              const mp = ((m.value - min) / (max - min)) * 100;
              return (
                <div key={m.value} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: `${mp}%` }}>
                  <span className={cn("size-1 rounded-full", m.value <= current ? "bg-brand-700" : "bg-neutral-400")} />
                  {m.label && <span className="absolute top-4 text-[10px] text-neutral-400 whitespace-nowrap">{m.label}</span>}
                </div>
              );
            })}

          <div
            id={fieldId}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={current}
            aria-disabled={disabled}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setHoverThumb(true)}
            onMouseLeave={() => setHoverThumb(false)}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className={cn(
              thumb,
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-neutral-0 border-2 border-brand-500 shadow outline-none transition-transform",
              "focus-visible:ring-4 focus-visible:ring-brand-100",
              !disabled && "hover:scale-110 active:scale-105 cursor-grab active:cursor-grabbing",
              disabled && "border-neutral-400 cursor-not-allowed"
            )}
            style={{ left: `${percent}%` }}
          >
            {showTip && (
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-md bg-neutral-900 text-neutral-0 text-xs px-1.5 py-0.5 whitespace-nowrap pointer-events-none tabular-nums">
                {formatValue(current)}
              </span>
            )}
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
}
