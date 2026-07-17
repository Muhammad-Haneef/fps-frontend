"use client";

import { useId, useMemo, useState } from "react";
import { cn, isValidEmail } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import TextInput from "./TextInput";

const COMMON_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

/** Suggest a fix for a likely-mistyped domain, e.g. "gmial.com" -> "gmail.com". */
function suggestDomain(email) {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;

  let best = null;
  let bestDist = Infinity;
  for (const candidate of COMMON_DOMAINS) {
    const dist = levenshtein(domain, candidate);
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  if (best && bestDist > 0 && bestDist <= 2) {
    return email.slice(0, at + 1) + best;
  }
  return null;
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]);
    }
  }
  return dp[a.length][b.length];
}

/**
 * EmailInput — email address field.
 *
 * Features:
 * - Live format validation (only shows error after blur, to avoid nagging while typing)
 * - Typo-tolerant domain suggestion ("Did you mean gmail.com?") with one-click fix
 * - Verified/success checkmark once valid
 * - Inherits every TextInput feature (clearable, sizes, icons, counter, etc.)
 */
export default function EmailInput({
  id,
  label = "Email address",
  value,
  defaultValue = "",
  onChange,
  error: externalError,
  validateOnBlur = true,
  showVerifiedState = true,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [touched, setTouched] = useState(false);

  const suggestion = useMemo(() => suggestDomain(internalValue), [internalValue]);
  const isValid = internalValue ? isValidEmail(internalValue) : true;

  const computedError =
    externalError || (touched && validateOnBlur && internalValue && !isValid ? "Enter a valid email address" : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <TextInput
        id={fieldId}
        type="email"
        label={label}
        value={internalValue}
        onChange={setInternalValue}
        onBlur={() => setTouched(true)}
        error={computedError}
        success={showVerifiedState && touched && internalValue && isValid && !suggestion ? "Looks good" : undefined}
        clearable
        autoComplete="email"
        leftIcon={<MailIcon />}
        {...rest}
      />
      {suggestion && !computedError && (
        <button
          type="button"
          onClick={() => setInternalValue(suggestion)}
          className="self-start text-xs text-brand-600 hover:text-brand-700 hover:underline -mt-1"
        >
          Did you mean <span className="font-medium">{suggestion}</span>?
        </button>
      )}
    </div>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-full">
      <path d="M3 4a2 2 0 0 0-2 2v.4l9 5.4 9-5.4V6a2 2 0 0 0-2-2H3Z" />
      <path d="M18 8.35l-8.63 5.18a.75.75 0 0 1-.74 0L0 8.35V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.35Z" />
    </svg>
  );
}
