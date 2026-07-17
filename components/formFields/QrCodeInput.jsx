"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * QrCodeInput — text field with a live QR code preview.
 *
 * Generating a real QR code (Reed-Solomon error correction, module matrix,
 * etc.) from scratch isn't practical as hand-rolled UI code, so — same
 * trade-off as `MapPicker`'s map tiles — the preview defaults to an `<img>`
 * pointed at a free public QR-generation endpoint (api.qrserver.com). Swap
 * in a real local encoder any time via the `renderQr` render-prop:
 *
 *   <QrCodeInput renderQr={(text, size) => <MyLocalQr value={text} size={size} />} />
 */
export default function QrCodeInput({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = "",
  onChange,
  placeholder = "https://example.com",
  previewSize = 160,
  errorCorrection = "M", // "L" | "M" | "Q" | "H"
  renderQr,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [text, setText] = useControllableState({ value, defaultValue, onChange });

  const qrUrl = text
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${previewSize}x${previewSize}&ecc=${errorCorrection}&data=${encodeURIComponent(text)}`
    : null;

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="flex flex-col gap-2">
        <input
          id={fieldId}
          type="text"
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          className={fieldBoxClasses({ size, error, disabled })}
        />

        {text && (
          <div className="rounded-[var(--radius-field)] border border-neutral-200 bg-neutral-0 p-3 flex flex-col items-center gap-2 self-start">
            {renderQr ? (
              renderQr(text, previewSize)
            ) : (
              <img
                src={qrUrl}
                alt={`QR code for ${text}`}
                width={previewSize}
                height={previewSize}
                className={cn("shrink-0", disabled && "opacity-60")}
              />
            )}
            <span className="text-xs text-neutral-400 max-w-[220px] truncate" title={text}>
              {text}
            </span>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
