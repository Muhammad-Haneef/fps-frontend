"use client";

import { useId, useRef, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * TextInput — the foundational single-line input.
 *
 * Features:
 * - Controlled or uncontrolled (`value`/`defaultValue` + `onChange`)
 * - Label, description, error, success states
 * - Left / right icon slots, prefix / suffix text (e.g. "https://", ".com")
 * - Clearable with an animated (x) button
 * - Loading state (spinner replaces right icon)
 * - Character counter (via `maxLength`)
 * - Size variants: sm / md / lg
 * - Full keyboard + screen-reader support (aria-invalid, aria-describedby)
 */
export default function TextInput({
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
  onKeyDown,
  required,
  disabled,
  readOnly,
  autoFocus,
  autoComplete,
  maxLength,
  size = "md",
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  clearable = false,
  loading = false,
  className,
  inputClassName,
  type = "text",
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({
    value,
    defaultValue,
    onChange,
  });
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const hasLeft = Boolean(leftIcon || prefix);
  const hasRight = Boolean(rightIcon || suffix || (clearable && internalValue) || loading);

  function handleChange(e) {
    let v = e.target.value;
    if (maxLength) v = v.slice(0, maxLength);
    setInternalValue(v);
  }

  function handleClear() {
    setInternalValue("");
    inputRef.current?.focus();
  }

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
      maxLength={maxLength}
      currentLength={internalValue?.length || 0}
      className={className}
    >
      <div className="relative flex items-stretch">
        {prefix && (
          <span
            className={cn(
              "flex items-center rounded-l-[var(--radius-field)] border border-r-0 bg-neutral-100 px-3 text-neutral-500 text-sm shrink-0",
              error ? "border-danger-400" : "border-neutral-300"
            )}
          >
            {prefix}
          </span>
        )}

        <div className="relative flex-1">
          {leftIcon && !prefix && (
            <span
              className={cn(
                "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400",
                sizeStyles[size].icon
              )}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={inputRef}
            id={fieldId}
            name={name}
            type={type}
            value={internalValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            maxLength={maxLength}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : description ? `${fieldId}-desc` : undefined}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onKeyDown={onKeyDown}
            className={cn(
              fieldBoxClasses({ size, error, success, disabled, hasLeftIcon: hasLeft, hasRightIcon: hasRight }),
              prefix && "rounded-l-none",
              suffix && "rounded-r-none",
              inputClassName
            )}
            {...rest}
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && <Spinner size={size} />}
            {!loading && clearable && internalValue && !disabled && !readOnly && (
              <button
                type="button"
                tabIndex={-1}
                onClick={handleClear}
                aria-label="Clear input"
                className="text-neutral-400 hover:text-neutral-700 transition-colors rounded-full p-0.5 hover:bg-neutral-100"
              >
                <ClearIcon className={sizeStyles[size].icon} />
              </button>
            )}
            {!loading && !clearable && rightIcon && (
              <span className={cn("text-neutral-400", sizeStyles[size].icon)}>{rightIcon}</span>
            )}
          </div>
        </div>

        {suffix && (
          <span
            className={cn(
              "flex items-center rounded-r-[var(--radius-field)] border border-l-0 bg-neutral-100 px-3 text-neutral-500 text-sm shrink-0",
              error ? "border-danger-400" : "border-neutral-300"
            )}
          >
            {suffix}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}

export function Spinner({ size = "md", className }) {
  return (
    <svg
      className={cn("animate-spin text-brand-500", sizeStyles[size].icon, className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function ClearIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}
