"use client";

import { cn, sizeStyles } from "@/lib/utils";

/**
 * FieldWrapper — the shared chrome around every input in this library.
 * Handles: label + required marker, helper/description text, error message
 * with icon, character counter, and consistent spacing/sizing.
 *
 * Every field component renders its control as `children`, passing this
 * wrapper the same set of label/error/description props so behavior is
 * 100% consistent across the whole library.
 */
export default function FieldWrapper({
  id,
  label,
  description,
  error,
  success,
  required,
  disabled,
  size = "md",
  maxLength,
  currentLength,
  hideCounter = false,
  className,
  labelAction, // optional node rendered at the right of the label (e.g. "Forgot password?")
  children,
}) {
  const showCounter = !hideCounter && typeof maxLength === "number";
  const nearLimit = showCounter && currentLength / maxLength >= 0.9;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", disabled && "opacity-60", className)}>
      {(label || labelAction) && (
        <div className="flex items-end justify-between gap-2">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "font-medium text-neutral-800 select-none",
                sizeStyles[size].label
              )}
            >
              {label}
              {required && <span className="text-danger-500 ml-0.5" aria-hidden="true">*</span>}
            </label>
          )}
          {labelAction && <span className="text-xs">{labelAction}</span>}
        </div>
      )}

      {children}

      {!description && !error && !success && !showCounter ? null : <div className="flex items-start justify-between gap-2 min-h-[1rem]">
        <div className="flex-1">
          {error ? (
            <p
              id={id ? `${id}-error` : undefined}
              role="alert"
              className="flex items-center gap-1 text-xs text-danger-600 animate-in fade-in slide-in-from-top-0.5"
            >
              <ErrorIcon />
              {error}
            </p>
          ) : success ? (
            <p className="flex items-center gap-1 text-xs text-success-600">
              <CheckIcon />
              {success}
            </p>
          ) : description ? (
            <p id={id ? `${id}-desc` : undefined} className="text-xs text-neutral-500">
              {description}
            </p>
          ) : null}
        </div>
        {showCounter && (
          <span
            className={cn(
              "text-xs tabular-nums shrink-0",
              nearLimit ? "text-warning-600" : "text-neutral-400",
              currentLength > maxLength && "text-danger-600 font-medium"
            )}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>}
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5 shrink-0">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5 shrink-0">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Shared class builder for the actual <input>/<textarea>/<button> "box" every field uses. */
export function fieldBoxClasses({ size = "md", error, success, disabled, hasLeftIcon, hasRightIcon }) {
  return cn(
    "w-full rounded-[var(--radius-field)] border bg-neutral-0 text-neutral-900 outline-none transition-all duration-150",
    "placeholder:text-neutral-400",
    "focus:ring-4",
    sizeStyles[size].input,
    hasLeftIcon && (size === "sm" ? "pl-8" : size === "lg" ? "pl-11" : "pl-9"),
    hasRightIcon && (size === "sm" ? "pr-8" : size === "lg" ? "pr-11" : "pr-9"),
    disabled && "cursor-not-allowed bg-neutral-100 text-neutral-400",
    error
      ? "border-danger-400 focus:border-danger-500 focus:ring-danger-100"
      : success
        ? "border-success-400 focus:border-success-500 focus:ring-success-100"
        : "border-neutral-300 focus:border-brand-500 focus:ring-brand-100 hover:border-neutral-400"
  );
}
