"use client";

import { useId, useState } from "react";
import { isValidUrl } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import TextInput from "./TextInput";

/**
 * UrlInput — website / link field.
 *
 * Features:
 * - Auto-prepends "https://" on blur if the user typed a bare domain
 * - Validates URL structure, only surfaces error after blur
 * - "Open link" action button once the value is a valid URL
 * - Inherits TextInput's clearable/sizes/icons/counter
 */
export default function UrlInput({
  id,
  label = "Website",
  placeholder = "example.com",
  value,
  defaultValue = "",
  onChange,
  error: externalError,
  autoPrependProtocol = true,
  showOpenButton = true,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [touched, setTouched] = useState(false);

  function handleBlur() {
    setTouched(true);
    if (autoPrependProtocol && internalValue && !/^https?:\/\//i.test(internalValue)) {
      setInternalValue(`https://${internalValue}`);
    }
  }

  const isValid = internalValue ? isValidUrl(internalValue) : true;
  const computedError = externalError || (touched && internalValue && !isValid ? "Enter a valid URL" : undefined);

  return (
    <TextInput
      id={fieldId}
      type="text"
      inputMode="url"
      label={label}
      placeholder={placeholder}
      value={internalValue}
      onChange={setInternalValue}
      onBlur={handleBlur}
      error={computedError}
      clearable
      leftIcon={<LinkIcon />}
      rightIcon={
        showOpenButton && internalValue && isValid ? (
          <a
            href={internalValue}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            className="pointer-events-auto hover:text-brand-600"
            aria-label="Open link in new tab"
          >
            <ExternalIcon />
          </a>
        ) : undefined
      }
      {...rest}
    />
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path d="M8.5 11.5a.75.75 0 0 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H4a.75.75 0 0 0 0 1.5h6.22L8.5 11.5Z" />
      <path d="M3 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H5v10h10v-3a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Z" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path d="M12.5 3a.75.75 0 0 0 0 1.5h2.19l-6.72 6.72a.75.75 0 1 0 1.06 1.06L15.75 5.56v2.19a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-.75-.75h-4Z" />
      <path d="M4.5 5A1.5 1.5 0 0 0 3 6.5v9A1.5 1.5 0 0 0 4.5 17h9a1.5 1.5 0 0 0 1.5-1.5v-4a.75.75 0 0 0-1.5 0v4h-9v-9h4a.75.75 0 0 0 0-1.5h-4Z" />
    </svg>
  );
}
