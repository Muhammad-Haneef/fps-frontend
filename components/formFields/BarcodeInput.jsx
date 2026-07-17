"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { encodeCode39, sanitizeCode39 } from "@/lib/barcodeUtils";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * BarcodeInput — text field that renders a live Code 39 barcode preview as
 * you type. Hand-rolled SVG encoder (`lib/barcodeUtils.js`), no barcode
 * library. Code 39 supports 0-9, A-Z (auto-uppercased) and `-.$/+% `.
 *
 * Features:
 * - Live SVG preview, human-readable text under the bars (toggle with `showText`)
 * - Invalid characters are flagged inline rather than silently dropped
 * - `height`/`unit` control the barcode's rendered size
 */
export default function BarcodeInput({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = "",
  onChange,
  placeholder = "e.g. SKU-12345",
  showText = true,
  height = 60,
  unit = 2,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [text, setText] = useControllableState({ value, defaultValue, onChange });

  const invalidChars = useMemo(() => {
    const upper = text.toUpperCase();
    const invalid = new Set();
    for (const c of upper) {
      if (!/^[0-9A-Z\-.$/+% ]$/.test(c)) invalid.add(c);
    }
    return Array.from(invalid);
  }, [text]);

  const { elements, totalWidth } = useMemo(() => encodeCode39(text, unit), [text, unit]);
  const clean = sanitizeCode39(text);
  const localError = invalidChars.length > 0 ? `Unsupported character${invalidChars.length > 1 ? "s" : ""}: ${invalidChars.join(" ")}` : "";

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error || localError} required={required} disabled={disabled} size={size} className={className}>
      <div className="flex flex-col gap-2">
        <input
          id={fieldId}
          type="text"
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          className={cn(fieldBoxClasses({ size, error: error || localError, disabled }), "uppercase tracking-wide")}
        />

        {clean.length > 0 && (
          <div className="rounded-[var(--radius-field)] border border-neutral-200 bg-neutral-0 p-3 flex flex-col items-center gap-1.5 overflow-x-auto">
            <svg viewBox={`0 0 ${totalWidth} ${height}`} width={totalWidth} height={height} className="shrink-0">
              <rect x="0" y="0" width={totalWidth} height={height} fill="white" />
              {elements.map((el, i) => (
                <rect key={i} x={el.x} y="0" width={el.width} height={height} fill="#111827" />
              ))}
            </svg>
            {showText && <span className="text-xs font-mono tracking-[0.2em] text-neutral-500">{clean}</span>}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
