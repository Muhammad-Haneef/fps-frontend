"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

export const DEFAULT_MOOD_SCALE = [
  { value: 1, emoji: "😞", label: "Terrible" },
  { value: 2, emoji: "🙁", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

/**
 * EmojiRating — mood/CSAT-style rating: a row of emoji faces, pick one.
 * Pass a custom `scale` (array of `{ value, emoji, label }`) to use a
 * different set (thumbs, satisfaction, effort, etc.) — the 5-face mood
 * scale is just the default.
 */
export default function EmojiRating({
  id,
  label,
  description,
  error,
  required,
  disabled,
  readOnly = false,
  value,
  defaultValue,
  onChange,
  scale = DEFAULT_MOOD_SCALE,
  size = "md",
  showLabel = true,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange });
  const [hover, setHover] = useState(null);
  const interactive = !disabled && !readOnly;

  const dims = { sm: "text-2xl size-9", md: "text-3xl size-12", lg: "text-4xl size-14" }[size];
  const activeEntry = scale.find((s) => s.value === (hover ?? current));

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div id={fieldId} role="radiogroup" className="flex flex-col gap-2" onMouseLeave={() => interactive && setHover(null)}>
        <div className="flex items-center gap-1.5">
          {scale.map((entry) => {
            const selected = current === entry.value;
            return (
              <button
                key={entry.value}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={entry.label}
                disabled={disabled}
                onMouseEnter={() => interactive && setHover(entry.value)}
                onFocus={() => interactive && setHover(entry.value)}
                onBlur={() => interactive && setHover(null)}
                onClick={() => interactive && setCurrent(entry.value)}
                className={cn(
                  dims,
                  "flex items-center justify-center rounded-full leading-none transition-all duration-150 outline-none",
                  "focus-visible:ring-4 focus-visible:ring-brand-100",
                  interactive && "cursor-pointer hover:scale-110 hover:bg-neutral-100",
                  !interactive && "cursor-default",
                  selected && "bg-brand-50 scale-110",
                  disabled && "opacity-50"
                )}
              >
                {entry.emoji}
              </button>
            );
          })}
        </div>
        {showLabel && (
          <span className={cn("text-xs text-neutral-500 h-4", !activeEntry && "opacity-0")}>{activeEntry?.label}</span>
        )}
      </div>
    </FieldWrapper>
  );
}
