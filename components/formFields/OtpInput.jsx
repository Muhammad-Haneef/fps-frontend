"use client";

import { useId, useRef, useState, useEffect } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

/**
 * OtpInput — one-time-passcode entry (SMS/email verification codes).
 *
 * Features:
 * - Individual boxed digit cells with auto-advance on type, auto-back on delete
 * - Full paste support (paste a 6-digit code anywhere and it fills all cells)
 * - Arrow-key navigation between cells
 * - Auto-submits via `onComplete` the instant all digits are filled
 * - Numeric-only by default; `alphanumeric` prop widens accepted characters
 */
export default function OtpInput({
  id,
  label = "Verification code",
  description,
  error,
  success,
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  disabled,
  autoFocus = true,
  alphanumeric = false,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const digits = internalValue.padEnd(length, " ").split("").slice(0, length);
  const inputsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (internalValue.length === length && !internalValue.includes(" ")) {
      onComplete?.(internalValue);
    }
  }, [internalValue, length, onComplete]);

  const pattern = alphanumeric ? /^[a-zA-Z0-9]$/ : /^[0-9]$/;

  function setDigit(index, char) {
    const arr = internalValue.padEnd(length, " ").split("");
    arr[index] = char;
    const next = arr.join("").replace(/\s+$/, "");
    setInternalValue(next);
  }

  function handleInputChange(index, e) {
    const raw = e.target.value;
    const char = raw.slice(-1);
    if (char && !pattern.test(char)) return;
    setDigit(index, char || "");
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (digits[index].trim() === "" && index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigit(index - 1, "");
        setActiveIndex(index - 1);
      } else {
        setDigit(index, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, length);
    if (!pasted) return;
    const valid = pasted.split("").every((c) => pattern.test(c));
    if (!valid) return;
    setInternalValue(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
    setActiveIndex(focusIndex);
  }

  const boxSize = { sm: "size-9 text-base", md: "size-11 text-lg", lg: "size-13 text-xl" }[size];

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} success={success} disabled={disabled} size={size} className={className}>
      <div className="flex gap-2" role="group" aria-label={label}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode={alphanumeric ? "text" : "numeric"}
            maxLength={1}
            value={d.trim()}
            disabled={disabled}
            onChange={(e) => handleInputChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => {
              e.target.select();
              setActiveIndex(i);
            }}
            aria-label={`Digit ${i + 1} of ${length}`}
            className={cn(
              "rounded-[var(--radius-field)] border text-center font-semibold outline-none transition-all duration-150 bg-neutral-0",
              boxSize,
              disabled && "bg-neutral-100 text-neutral-400 cursor-not-allowed",
              error
                ? "border-danger-400 focus:ring-4 focus:ring-danger-100"
                : "border-neutral-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100",
              activeIndex === i && "border-brand-500"
            )}
          />
        ))}
      </div>
    </FieldWrapper>
  );
}
