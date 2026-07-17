"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import { ChevronIcon, CheckIcon, XIcon } from "./Select";
import FloatingPanel from "./FloatingPanel";

/**
 * MultiSelect — multi-value dropdown, selected items shown as removable chips
 * inside the control itself (classic "tokenized" select pattern).
 *
 * Features:
 * - Chips with per-chip remove (×), backspace removes the last chip
 * - Type-to-search filtering, "Select all" / "Clear all" actions
 * - Max-selection limit with inline count
 * - Collapses overflow chips into a "+N more" badge when `maxVisibleChips` is set
 */
export default function MultiSelect({
  id,
  label,
  description,
  error,
  success,
  required,
  disabled,
  placeholder = "Select options",
  options = [],
  value,
  defaultValue = [],
  onChange,
  searchable = true,
  max,
  maxVisibleChips,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useClickOutside(() => setOpen(false));
  const inputRef = useRef(null);

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );
  const selectedOptions = options.filter((o) => selected.includes(o.value));
  const visibleChips = maxVisibleChips ? selectedOptions.slice(0, maxVisibleChips) : selectedOptions;
  const overflowCount = maxVisibleChips ? Math.max(0, selectedOptions.length - maxVisibleChips) : 0;

  function toggle(val) {
    if (selected.includes(val)) {
      setSelected(selected.filter((v) => v !== val));
    } else {
      if (typeof max === "number" && selected.length >= max) return;
      setSelected([...selected, val]);
    }
  }

  function handleBackspace(e) {
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      setSelected(selected.slice(0, -1));
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} success={success} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <div
          onClick={() => !disabled && (setOpen(true), inputRef.current?.focus())}
          className={cn(
            fieldBoxClasses({ size, error, success, disabled }),
            "h-auto min-h-[var(--h)] flex flex-wrap items-center gap-1.5 py-1.5 cursor-text"
          )}
          style={{ "--h": size === "sm" ? "2rem" : size === "lg" ? "3rem" : "2.5rem" }}
        >
          {visibleChips.map((opt) => (
            <span key={opt.value} className="inline-flex items-center gap-1 rounded-md bg-brand-50 text-brand-700 pl-2 pr-1 py-0.5 text-xs font-medium">
              {opt.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(opt.value);
                }}
                className="hover:bg-brand-100 rounded-sm p-0.5"
                aria-label={`Remove ${opt.label}`}
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
          {overflowCount > 0 && (
            <span className="inline-flex items-center rounded-md bg-neutral-100 text-neutral-600 px-2 py-0.5 text-xs font-medium">
              +{overflowCount} more
            </span>
          )}
          {searchable ? (
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onKeyDown={handleBackspace}
              placeholder={selectedOptions.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[80px] outline-none bg-transparent text-sm placeholder:text-neutral-400"
            />
          ) : (
            selectedOptions.length === 0 && <span className="text-neutral-400 text-sm">{placeholder}</span>
          )}
          <ChevronIcon className={cn("ml-auto shrink-0 text-neutral-400 transition-transform size-4", open && "rotate-180")} />
        </div>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={true} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-100">
              <button type="button" onClick={() => setSelected(options.map((o) => o.value))} className="text-xs text-brand-600 hover:underline">
                Select all
              </button>
              <button type="button" onClick={() => setSelected([])} className="text-xs text-neutral-400 hover:underline">
                Clear
              </button>
            </div>
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {filtered.map((opt) => {
                const isSelected = selected.includes(opt.value);
                const disabledOpt = opt.disabled || (!isSelected && typeof max === "number" && selected.length >= max);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      disabled={disabledOpt}
                      onClick={() => toggle(opt.value)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-neutral-50 transition-colors",
                        disabledOpt && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className={cn("size-4 rounded border-2 flex items-center justify-center shrink-0", isSelected ? "bg-brand-500 border-brand-500" : "border-neutral-300")}>
                        {isSelected && <CheckIcon className="size-3 text-white" />}
                      </span>
                      {opt.label}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && <li className="px-3 py-3 text-sm text-neutral-400 text-center">No options found</li>}
            </ul>
          </FloatingPanel>
        )}
      </div>
      {typeof max === "number" && (
        <p className="text-xs text-neutral-400">{selected.length}/{max} selected</p>
      )}
    </FieldWrapper>
  );
}
