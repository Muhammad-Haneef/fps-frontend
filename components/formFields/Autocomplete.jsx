"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

/**
 * Autocomplete — a plain text input that suggests matches as you type, but
 * (unlike Combobox/Select) still accepts any free-text value the user types,
 * even if it doesn't match a suggestion. Good for tag-like or "pick or type
 * your own" fields (job titles, city names, search-as-you-type).
 *
 * Features:
 * - Highlights the matching substring in each suggestion
 * - Keyboard nav (↑ ↓ Enter Esc), click-to-select
 * - `onSearch` for async/remote suggestion sources (debounce it yourself or use AsyncSelect)
 */
export default function Autocomplete({
  id,
  label,
  description,
  error,
  required,
  disabled,
  placeholder = "Start typing...",
  suggestions = [], // array of strings or { value, label }
  value,
  defaultValue = "",
  onChange,
  onSearch,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useClickOutside(() => setOpen(false));
  const inputRef = useRef(null);

  const normalized = suggestions.map((s) => (typeof s === "string" ? { value: s, label: s } : s));
  const filtered = useMemo(
    () => normalized.filter((s) => s.label.toLowerCase().includes(internalValue.toLowerCase())).slice(0, 8),
    [normalized, internalValue]
  );

  useEffect(() => {
    onSearch?.(internalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue]);

  function highlight(label) {
    const idx = label.toLowerCase().indexOf(internalValue.toLowerCase());
    if (idx === -1 || !internalValue) return label;
    return (
      <>
        {label.slice(0, idx)}
        <strong className="font-semibold text-brand-700">{label.slice(idx, idx + internalValue.length)}</strong>
        {label.slice(idx + internalValue.length)}
      </>
    );
  }

  function handleKeyDown(e) {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      setInternalValue(filtered[activeIndex].value);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <input
          ref={inputRef}
          id={fieldId}
          type="text"
          role="combobox"
          aria-expanded={open}
          value={internalValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setInternalValue(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(fieldBoxClasses({ size, error, disabled }))}
        />
        {open && filtered.length > 0 && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={true} className="max-h-64 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg py-1">
            {filtered.map((s, i) => (
              <li key={s.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={activeIndex === i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    setInternalValue(s.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm text-left",
                    activeIndex === i ? "bg-brand-50" : "hover:bg-neutral-50"
                  )}
                >
                  {highlight(s.label)}
                </button>
              </li>
            ))}
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}
