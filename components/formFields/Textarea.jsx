"use client";

import { useId, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * Textarea — multi-line text field.
 *
 * Features:
 * - Auto-resize to fit content (with min/max row clamp)
 * - Character counter, required, error/success states
 * - Resizable handle toggle (`resize` prop: "none" | "vertical" | "both")
 * - Word count mode (`countMode="words"`)
 */
export default function Textarea({
  id,
  name,
  label,
  description,
  error,
  success,
  placeholder,
  value,
  defaultValue = "",
  onChange,
  onBlur,
  onFocus,
  required,
  disabled,
  readOnly,
  autoFocus,
  maxLength,
  rows = 3,
  minRows = 2,
  maxRows = 10,
  autoResize = true,
  resize = "vertical",
  countMode = "chars", // "chars" | "words"
  size = "md",
  className,
  textareaClassName,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const ref = useRef(null);

  const resizeTextarea = useCallback(() => {
    const el = ref.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(el).lineHeight || "20", 10);
    const minH = lineHeight * minRows;
    const maxH = lineHeight * maxRows;
    const next = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
  }, [autoResize, minRows, maxRows]);

  useEffect(() => {
    resizeTextarea();
  }, [internalValue, resizeTextarea]);

  const wordCount = countMode === "words"
    ? (internalValue?.trim() ? internalValue.trim().split(/\s+/).length : 0)
    : internalValue?.length || 0;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      description={description}
      error={error}
      success={success}
      required={required}
      disabled={disabled}
      size={size}
      maxLength={countMode === "chars" ? maxLength : undefined}
      currentLength={wordCount}
      hideCounter={!maxLength && countMode !== "words"}
      className={className}
    >
      <textarea
        ref={ref}
        id={fieldId}
        name={name}
        rows={rows}
        value={internalValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        maxLength={countMode === "chars" ? maxLength : undefined}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : description ? `${fieldId}-desc` : undefined}
        onChange={(e) => setInternalValue(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          fieldBoxClasses({ size, error, success, disabled }),
          "py-2 leading-5",
          resize === "none" && "resize-none",
          resize === "vertical" && "resize-y",
          resize === "both" && "resize",
          autoResize && "resize-none overflow-hidden",
          textareaClassName
        )}
        {...rest}
      />
    </FieldWrapper>
  );
}
