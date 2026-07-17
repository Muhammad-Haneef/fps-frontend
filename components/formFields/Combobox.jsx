"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";
import { CheckIcon, ChevronIcon } from "./Select";

/**
 * Combobox — a text input combined with a listbox, following the standard
 * ARIA combobox pattern. Unlike Autocomplete, the value is expected to
 * resolve to one of the known `options` — on blur, if the typed text
 * doesn't match any option label, the field reverts to the last valid value.
 *
 * Features:
 * - Type to filter, full keyboard support, revert-on-invalid-blur
 * - Create-new option support (`allowCreate`) with an "Add “x”" row
 */
export default function Combobox({
  id,
  label,
  description,
  error,
  required,
  disabled,
  placeholder = "Select or search...",
  options = [],
  value,
  defaultValue = "",
  onChange,
  allowCreate = false,
  onCreateOption,
  size = "md",
  className,
  inputClassName,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const selectedOption = options.find((o) => o.value === selected);
  const [inputText, setInputText] = useState(selectedOption?.label || "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useClickOutside(() => handleBlurClose());
  const inputRef = useRef(null);

  useEffect(() => {
    setInputText(selectedOption?.label || "");
  }, [selectedOption]);

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(inputText.toLowerCase())),
    [options, inputText]
  );

  const exactMatch = options.find((o) => o.label.toLowerCase() === inputText.toLowerCase());
  const showCreate = allowCreate && inputText && !exactMatch;

  function handleBlurClose() {
    setOpen(false);
    // Revert to last valid selection if the typed text doesn't match anything.
    if (!exactMatch && !showCreate) setInputText(selectedOption?.label || "");
  }

  function selectOption(opt) {
    setSelected(opt.value);
    setInputText(opt.label);
    setOpen(false);
  }

  function handleCreate() {
    const newOpt = { value: inputText, label: inputText };
    onCreateOption?.(newOpt);
    selectOption(newOpt);
  }

  function handleKeyDown(e) {
    const total = filtered.length + (showCreate ? 1 : 0);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex < filtered.length && filtered[activeIndex]) selectOption(filtered[activeIndex]);
      else if (showCreate) handleCreate();
    } else if (e.key === "Escape") {
      handleBlurClose();
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <input
            ref={inputRef}
            id={fieldId}
            type="text"
            role="combobox"
            aria-expanded={open}
            value={inputText}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
              setInputText(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className={cn(fieldBoxClasses({ size, error, disabled, hasRightIcon: true }), inputClassName)}
          />
          <ChevronIcon className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 transition-transform pointer-events-none", open && "rotate-180")} />
        </div>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {filtered.map((opt, i) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeIndex === i}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectOption(opt)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                      activeIndex === i ? "bg-brand-50 text-brand-700" : "hover:bg-neutral-50",
                      selected === opt.value && "font-medium"
                    )}
                  >
                    <span className="flex-1 truncate">{opt.label}</span>
                    {selected === opt.value && <CheckIcon className="size-4 shrink-0" />}
                  </button>
                </li>
              ))}
              {showCreate && (
                <li>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(filtered.length)}
                    onClick={handleCreate}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-brand-600 border-t border-neutral-100",
                      activeIndex === filtered.length ? "bg-brand-50" : "hover:bg-neutral-50"
                    )}
                  >
                    Add "{inputText}"
                  </button>
                </li>
              )}
              {filtered.length === 0 && !showCreate && (
                <li className="px-3 py-3 text-sm text-neutral-400 text-center">No matches found</li>
              )}
            </ul>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}
