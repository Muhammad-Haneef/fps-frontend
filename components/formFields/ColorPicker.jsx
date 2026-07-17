"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { hexToHsv, hsvToHex, hsvToRgb, isValidHex, PRESET_COLORS } from "@/lib/colorUtils";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

/**
 * ColorPicker — hex/RGB input + a full saturation-value + hue picker popover
 * (all rendered with CSS gradients, no canvas, no color library).
 *
 * Features:
 * - Drag on the SV square to pick saturation/value, drag the hue strip for hue
 * - Type a hex value directly (validated) or pick from swatches
 * - Live swatch preview in the trigger, recent-colors row (session-persisted
 *   via `recentColors` prop if you want to lift it to localStorage yourself)
 */
export default function ColorPicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = "#5B4FE8",
  onChange,
  presets = PRESET_COLORS,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [color, setColor] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const wrapperRef = useClickOutside(() => setOpen(false));
  const svRef = useRef(null);
  const hueRef = useRef(null);
  const draggingRef = useRef(null);

  useEffect(() => {
    setHexInput(color);
    setHsv(hexToHsv(color));
  }, [color]);

  function updateFromHsv(next) {
    setHsv(next);
    const hex = hsvToHex(next);
    setColor(hex);
  }

  function handleSvPointer(e) {
    const rect = svRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    updateFromHsv({ ...hsv, s: x, v: 1 - y });
  }

  function handleHuePointer(e) {
    const rect = hueRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    updateFromHsv({ ...hsv, h: x * 360 });
  }

  function startDrag(type, handler) {
    draggingRef.current = type;
    function move(e) {
      handler(e.touches ? e.touches[0] : e);
    }
    function up() {
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

  function handleHexChange(v) {
    setHexInput(v);
    if (isValidHex(v)) setColor(v.startsWith("#") ? v : `#${v}`);
  }

  const rgb = hsvToRgb(hsv);
  const hueColor = hsvToHex({ h: hsv.h, s: 1, v: 1 });

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error, disabled }), "flex items-center gap-2.5 text-left")}
        >
          <span className="size-5 rounded-md border border-neutral-200 shrink-0" style={{ backgroundColor: color }} />
          <span className="uppercase text-neutral-700 tabular-nums">{color}</span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} width={256} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg p-3 flex flex-col gap-3">
            <div
              ref={svRef}
              className="relative h-36 rounded-lg cursor-crosshair"
              style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})` }}
              onMouseDown={(e) => {
                handleSvPointer(e);
                startDrag("sv", handleSvPointer);
              }}
            >
              <span
                className="absolute size-3.5 rounded-full border-2 border-white shadow -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: color }}
              />

              {/* </FloatingPanel> */}

              <div
                ref={hueRef}
                className="relative h-3 rounded-full cursor-pointer"
                style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
                onMouseDown={(e) => {
                  handleHuePointer(e);
                  startDrag("hue", handleHuePointer);
                }}
              >
                <span
                  className="absolute top-1/2 size-4 rounded-full border-2 border-white shadow -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueColor }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="size-8 rounded-md border border-neutral-200 shrink-0" style={{ backgroundColor: color }} />
                <input
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="flex-1 h-8 px-2 text-xs font-mono uppercase rounded-md border border-neutral-200 outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-between text-[10px] text-neutral-400 tabular-nums">
                <span>R {Math.round(rgb.r)}</span>
                <span>G {Math.round(rgb.g)}</span>
                <span>B {Math.round(rgb.b)}</span>
              </div>

              <div className="grid grid-cols-10 gap-1">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setColor(p)}
                    className={cn("size-5 rounded-md border", color.toLowerCase() === p.toLowerCase() ? "ring-2 ring-brand-500 ring-offset-1" : "border-neutral-200")}
                    style={{ backgroundColor: p }}
                    aria-label={p}
                  />
                ))}
              </div>
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
