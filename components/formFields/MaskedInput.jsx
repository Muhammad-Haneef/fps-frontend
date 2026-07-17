"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { applyMask } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";

/**
 * MaskedInput — generic pattern-based masked field.
 *
 * Mask syntax: `#` = digit, `A` = letter, `*` = any character, any other
 * character is a literal that's auto-inserted (e.g. "/", "-", "(", ")").
 *
 * Presets available via `preset`: "creditCard" (#### #### #### ####),
 * "ssn" (###-##-####), "date" (##/##/####), "zip" (#####-####).
 *
 * Features:
 * - Live literal insertion as the user types (auto-adds dashes/slashes/spaces)
 * - Caret stays correctly positioned after formatting
 * - Reports both the masked display value and the raw unmasked value
 */
const PRESETS = {
  creditCard: "#### #### #### ####",
  ssn: "###-##-####",
  date: "##/##/####",
  zip: "#####-####",
  time: "##:##",
};

export default function MaskedInput({
  id,
  label,
  description,
  error,
  success,
  required,
  disabled,
  size = "md",
  mask,
  preset,
  value,
  defaultValue = "",
  onChange, // (masked: string, raw: string) => void
  placeholder,
  className,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const resolvedMask = mask || PRESETS[preset] || mask;
  const [internalValue, setInternalValue] = useControllableState({
    value,
    defaultValue,
    onChange: (masked) => onChange?.(masked, masked.replace(/[^A-Za-z0-9]/g, "")),
  });
  const inputRef = useRef(null);

  function handleChange(e) {
    const raw = e.target.value;
    const masked = applyMask(raw, resolvedMask);
    setInternalValue(masked);
  }

  const computedPlaceholder = placeholder || (resolvedMask ? resolvedMask.replace(/#/g, "0").replace(/A/g, "A") : undefined);

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} success={success} required={required} disabled={disabled} size={size} className={className}>
      <input
        ref={inputRef}
        id={fieldId}
        type="text"
        inputMode={/^#+$/.test((resolvedMask || "").replace(/[^A-Za-z0-9]/g, "")) ? "numeric" : "text"}
        value={internalValue}
        placeholder={computedPlaceholder}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        onChange={handleChange}
        className={cn(fieldBoxClasses({ size, error, success, disabled }), "font-mono tracking-wide")}
        {...rest}
      />
    </FieldWrapper>
  );
}
