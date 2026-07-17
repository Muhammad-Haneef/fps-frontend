"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn, sizeStyles, debounce } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import { Spinner } from "./TextInput";
import FloatingPanel from "./FloatingPanel";

/**
 * SearchInput — search box built for real product search bars.
 *
 * Features:
 * - Debounced `onSearch` callback (separate from immediate `onChange`)
 * - Loading state while a search is in flight
 * - Recent-searches / suggestions dropdown (keyboard navigable: ↑ ↓ Enter Esc)
 * - "/" or Cmd+K style focus shortcut (opt-in via `shortcut` prop, e.g. "/")
 * - Clear button, empty-state friendly
 */
export default function SearchInput({
  id,
  label,
  placeholder = "Search...",
  value,
  defaultValue = "",
  onChange,
  onSearch,
  debounceMs = 300,
  loading = false,
  suggestions = [],
  onSelectSuggestion,
  shortcut,
  size = "md",
  className,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [internalValue, setInternalValue] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const wrapperRef = useClickOutside(() => setOpen(false));

  const debouncedSearch = useMemo(() => debounce((v) => onSearch?.(v), debounceMs), [onSearch, debounceMs]);

  useEffect(() => {
    if (onSearch) debouncedSearch(internalValue);
    return () => debouncedSearch.cancel();
  }, [internalValue, debouncedSearch, onSearch]);

  useEffect(() => {
    if (!shortcut) return;
    function handler(e) {
      if (e.key === shortcut && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcut]);

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const s = suggestions[activeIndex];
      setInternalValue(typeof s === "string" ? s : s.label);
      onSelectSuggestion?.(s);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <span className={cn("pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400", sizeStyles[size].icon)}>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            id={fieldId}
            type="search"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${fieldId}-listbox`}
            value={internalValue}
            placeholder={placeholder}
            onChange={(e) => {
              setInternalValue(e.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className={cn(fieldBoxClasses({ size, hasLeftIcon: true, hasRightIcon: true }), "[&::-webkit-search-cancel-button]:hidden")}
            {...rest}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {loading && <Spinner size={size} />}
            {!loading && internalValue && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => {
                  setInternalValue("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="text-neutral-400 hover:text-neutral-700 rounded-full p-0.5 hover:bg-neutral-100"
              >
                <ClearIcon className={sizeStyles[size].icon} />
              </button>
            )}
            {!loading && !internalValue && shortcut && (
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-neutral-200 bg-neutral-50 px-1.5 text-[10px] font-medium text-neutral-400">
                {shortcut}
              </kbd>
            )}
          </div>
        </div>

        {open && suggestions.length > 0 && (
          <FloatingPanel
            anchorRef={wrapperRef}
            open={open}
            matchWidth
            className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden"
          >
            <ul
              id={`${fieldId}-listbox`}
              role="listbox"
              className="max-h-64 overflow-y-auto py-1"
            >
              {suggestions.map((s, i) => {
                const label = typeof s === "string" ? s : s.label;
                return (
                  <li key={label + i}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={activeIndex === i}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => {
                        setInternalValue(label);
                        onSelectSuggestion?.(s);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                        activeIndex === i ? "bg-brand-50 text-brand-700" : "hover:bg-neutral-50"
                      )}
                    >
                      <SearchIcon className="size-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function SearchIcon({ className = "size-full" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m17 17-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
