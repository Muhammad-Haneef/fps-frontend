"use client";

import { useId, useRef, useState } from "react";
import { cn, sizeStyles, getPasswordStrength } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * PasswordInput — password entry with UX guardrails.
 *
 * Features:
 * - Show/hide toggle (eye icon)
 * - Live strength meter (very weak → strong) with color-coded bar
 * - Caps Lock warning
 * - Optional requirement checklist (min length, upper/lower, number, symbol)
 * - Character counter, error/success states
 */
export default function PasswordInput({
  id,
  name,
  label = "Password",
  description,
  error,
  success,
  placeholder = "Enter your password",
  value,
  defaultValue = "",
  onChange,
  onBlur,
  onFocus,
  required,
  disabled,
  autoComplete = "current-password",
  maxLength,
  size = "md",
  showStrength = false,
  showRequirements = false,
  minLength = 8,
  className,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const inputRef = useRef(null);

  const strength = showStrength ? getPasswordStrength(internalValue) : null;

  const requirements = [
    { label: `At least ${minLength} characters`, met: internalValue.length >= minLength },
    { label: "Upper & lowercase letters", met: /[a-z]/.test(internalValue) && /[A-Z]/.test(internalValue) },
    { label: "At least one number", met: /\d/.test(internalValue) },
    { label: "At least one symbol", met: /[^A-Za-z0-9]/.test(internalValue) },
  ];

  function handleKeyEvent(e) {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
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
      hideCounter={!maxLength}
      className={className}
    >
      <div className="relative">
        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type={visible ? "text" : "password"}
          value={internalValue}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          required={required}
          aria-invalid={Boolean(error)}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={handleKeyEvent}
          onKeyUp={handleKeyEvent}
          onFocus={onFocus}
          onBlur={(e) => {
            setCapsLock(false);
            onBlur?.(e);
          }}
          className={cn(fieldBoxClasses({ size, error, success, disabled, hasRightIcon: true }))}
          {...rest}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-full p-0.5 hover:bg-neutral-100"
        >
          {visible ? <EyeOffIcon className={sizeStyles[size].icon} /> : <EyeIcon className={sizeStyles[size].icon} />}
        </button>
      </div>

      {capsLock && (
        <p className="flex items-center gap-1 text-xs text-warning-600 -mt-0.5">
          <WarnIcon className="size-3.5" /> Caps Lock is on
        </p>
      )}

      {showStrength && internalValue && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-200",
                  i <= strength.score ? strength.color : "bg-neutral-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500">{strength.label}</span>
        </div>
      )}

      {showRequirements && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mt-1">
          {requirements.map((r) => (
            <li key={r.label} className={cn("flex items-center gap-1.5 text-xs", r.met ? "text-success-600" : "text-neutral-400")}>
              <span className={cn("size-3.5 rounded-full flex items-center justify-center shrink-0", r.met ? "bg-success-500" : "bg-neutral-200")}>
                {r.met && (
                  <svg viewBox="0 0 12 12" fill="none" className="size-2.5">
                    <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </FieldWrapper>
  );
}

function EyeIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 3.5c-4.14 0-7.67 2.61-9 6.5 1.33 3.89 4.86 6.5 9 6.5s7.67-2.61 9-6.5c-1.33-3.89-4.86-6.5-9-6.5Zm0 10.83A4.33 4.33 0 1 1 10 5.67a4.33 4.33 0 0 1 0 8.66Zm0-6.83a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
    </svg>
  );
}
function EyeOffIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M2.7 2.7a.75.75 0 0 0-1.06 1.06l3.02 3.02C3.1 8.03 1.86 9.55 1 11c1.33 3.89 4.86 6.5 9 6.5 1.65 0 3.19-.42 4.51-1.16l3.29 3.29a.75.75 0 1 0 1.06-1.06L2.7 2.7Zm7.8 9.9-3.02-3.02A2.5 2.5 0 0 0 10 12.5c.2 0 .4-.02.5-.06ZM10 5.67c.62 0 1.2.14 1.72.4l1.13 1.13a4.33 4.33 0 0 1 1.15 3.9l1.13 1.13c.94-1.03 1.7-2.29 2.17-3.73-1.33-3.89-4.86-6.5-9-6.5-.9 0-1.77.12-2.6.35l1.35 1.35A4.3 4.3 0 0 1 10 5.67Z" />
    </svg>
  );
}
function WarnIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
  );
}
