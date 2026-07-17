"use client";

import { useId, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

/**
 * PinInput — secure numeric PIN entry (app lock, transaction confirmation).
 *
 * Differs from OtpInput in intent: values are masked as dots by default (like a
 * password), with an optional reveal toggle, and is tuned for short 4-6 digit PINs.
 *
 * Features:
 * - Masked dot display with per-cell reveal-while-typing flash
 * - Global show/hide toggle
 * - Auto-advance, backspace-back, arrow navigation, paste support
 * - onComplete callback once all digits are filled
 */
export default function PinInput({
  id,
  label = "Enter PIN",
  description,
  error,
  length = 4,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  disabled,
  maskDelay = 400,
  allowReveal = true,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [revealed, setRevealed] = useState(false);
  const [flashIndex, setFlashIndex] = useState(-1);
  const inputsRef = useRef([]);
  const digits = internalValue.padEnd(length, " ").split("").slice(0, length);

  useEffect(() => {
    if (internalValue.length === length) onComplete?.(internalValue);
  }, [internalValue, length, onComplete]);

  function setDigit(index, char) {
    const arr = internalValue.padEnd(length, " ").split("");
    arr[index] = char;
    setInternalValue(arr.join("").replace(/\s+$/, ""));
  }

  function handleChange(index, e) {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) {
      setDigit(index, "");
      return;
    }
    setDigit(index, char);
    setFlashIndex(index);
    setTimeout(() => setFlashIndex((i) => (i === index ? -1 : i)), maskDelay);
    if (index < length - 1) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && digits[index].trim() === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigit(index - 1, "");
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    setInternalValue(pasted);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  const boxSize = { sm: "size-9", md: "size-11", lg: "size-13" }[size];

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} disabled={disabled} size={size} className={className}
      labelAction={
        allowReveal && (
          <button type="button" onClick={() => setRevealed((r) => !r)} className="text-brand-600 hover:underline">
            {revealed ? "Hide" : "Show"}
          </button>
        )
      }
    >
      <div className="flex gap-2" role="group" aria-label={label}>
        {digits.map((d, i) => {
          const showDigit = revealed || flashIndex === i;
          return (
            <div key={i} className="relative">
              <input
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={showDigit ? d.trim() : d.trim() ? "•" : ""}
                disabled={disabled}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                aria-label={`PIN digit ${i + 1} of ${length}`}
                className={cn(
                  "rounded-[var(--radius-field)] border text-center font-bold outline-none transition-all duration-150 bg-neutral-0",
                  boxSize,
                  disabled && "bg-neutral-100 text-neutral-400 cursor-not-allowed",
                  error
                    ? "border-danger-400 focus:ring-4 focus:ring-danger-100"
                    : "border-neutral-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                )}
              />
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
