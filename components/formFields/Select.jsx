"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import { Spinner } from "./TextInput";
import FloatingPanel from "./FloatingPanel";

/**
 * Select — single-value dropdown select, fully custom (no native <select>).
 *
 * `options`: [{ value, label, description, icon, disabled }] or grouped:
 * [{ group: "Fruits", options: [...] }]
 *
 * Features:
 * - Type-to-search filtering (opt out with `searchable={false}`)
 * - Grouped options with sticky group headers
 * - Keyboard nav: ↑ ↓ to move, Enter to select, Esc to close, Home/End
 * - Clearable, loading state, custom option rendering via `renderOption`
 * - Scrolls active option into view automatically
 */
export default function Select({
  id,
  label,
  description,
  error,
  success,
  required,
  disabled,
  placeholder = "Select an option",
  options = [],
  value,
  defaultValue = "",
  onChange,
  searchable = true,
  clearable = false,
  loading = false,
  size = "md",
  renderOption,
  className,
  inputClassName,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useClickOutside(() => setOpen(false));
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const isGrouped = options.length > 0 && options[0]?.group !== undefined;
  const flatOptions = isGrouped ? options.flatMap((g) => g.options) : options;
  const selectedOption = flatOptions.find((o) => o.value === selected);

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    if (isGrouped) {
      return options
        .map((g) => ({ ...g, options: g.options.filter((o) => o.label.toLowerCase().includes(q)) }))
        .filter((g) => g.options.length > 0);
    }
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, isGrouped]);

  const flatFiltered = isGrouped ? filtered.flatMap((g) => g.options) : filtered;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  function handleKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = flatFiltered[activeIndex];
      if (opt && !opt.disabled) {
        setSelected(opt.value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Home") {
      setActiveIndex(0);
    } else if (e.key === "End") {
      setActiveIndex(flatFiltered.length - 1);
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} success={success} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            fieldBoxClasses({ size, error, success, disabled, hasRightIcon: false }),
            "flex items-center justify-between text-left",
            inputClassName
          )}
        >
          <span className={cn("truncate flex items-center gap-2", !selectedOption && "text-neutral-400")}>
            {selectedOption?.icon}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            {loading && <Spinner size={size} />}
            {clearable && selected && !loading && (
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected("");
                }}
                className="text-neutral-400 hover:text-neutral-700 rounded-full p-0.5 hover:bg-neutral-100"
              >
                <XIcon className={sizeStyles[size].icon} />
              </span>
            )}
            <ChevronIcon className={cn(sizeStyles[size].icon, "text-neutral-400 transition-transform", open && "rotate-180")} />
          </span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            {searchable && (
              <div className="p-1.5 border-b border-neutral-100">
                <input
                  ref={inputRef}
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="w-full h-8 px-2 text-sm rounded-md border border-neutral-200 outline-none focus:border-brand-500"
                />
              </div>
            )}
            <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto py-1">
              {isGrouped
                ? filtered.map((g) => (
                  <li key={g.group}>
                    <div className="px-3 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide sticky top-0 bg-neutral-0">
                      {g.group}
                    </div>
                    {g.options.map((opt) => (
                      <OptionRow
                        key={opt.value}
                        opt={opt}
                        index={flatFiltered.indexOf(opt)}
                        activeIndex={activeIndex}
                        selected={selected}
                        renderOption={renderOption}
                        onSelect={(v) => {
                          setSelected(v);
                          setOpen(false);
                        }}
                        onHover={setActiveIndex}
                      />
                    ))}
                  </li>
                ))
                : filtered.map((opt, i) => (
                  <OptionRow
                    key={opt.value}
                    opt={opt}
                    index={i}
                    activeIndex={activeIndex}
                    selected={selected}
                    renderOption={renderOption}
                    onSelect={(v) => {
                      setSelected(v);
                      setOpen(false);
                    }}
                    onHover={setActiveIndex}
                  />
                ))}
              {flatFiltered.length === 0 && <li className="px-3 py-3 text-sm text-neutral-400 text-center">No options found</li>}
            </ul>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

export function OptionRow({ opt, index, activeIndex, selected, renderOption, onSelect, onHover }) {
  return (
    <li>
      <button
        type="button"
        role="option"
        data-index={index}
        aria-selected={selected === opt.value}
        disabled={opt.disabled}
        onMouseEnter={() => onHover(index)}
        onClick={() => !opt.disabled && onSelect(opt.value)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
          activeIndex === index ? "bg-brand-50 text-brand-700" : "hover:bg-neutral-50",
          selected === opt.value && "font-medium",
          opt.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {renderOption ? (
          renderOption(opt)
        ) : (
          <>
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="flex-1 truncate">
              {opt.label}
              {opt.description && <span className="block text-xs text-neutral-400">{opt.description}</span>}
            </span>
            {selected === opt.value && <CheckIcon className="size-4 text-brand-500 shrink-0" />}
          </>
        )}
      </button>
    </li>
  );
}

export function ChevronIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" /></svg>;
}
export function XIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>;
}
export function CheckIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>;
}
