"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn, sizeStyles, debounce } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import { ChevronIcon, CheckIcon } from "./Select";
import { Spinner } from "./TextInput";
import FloatingPanel from "./FloatingPanel";

/**
 * AsyncSelect — like Select, but options come from a remote source.
 *
 * `loadOptions(query) => Promise<[{ value, label, description }]>`
 *
 * Features:
 * - Debounced remote fetch as the user types (default 350ms)
 * - Loading, empty, and error states handled distinctly
 * - Result caching per-query within the session (avoids re-fetching repeats)
 * - Minimum query length before searching (`minChars`)
 */
export default function AsyncSelect({
  id,
  label,
  description,
  error: externalError,
  required,
  disabled,
  placeholder = "Search...",
  loadOptions,
  value,
  defaultValue = "",
  defaultLabel = "",
  onChange, // (value, option) => void
  debounceMs = 350,
  minChars = 1,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: (v) => onChange?.(v, options.find((o) => o.value === v)) });
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const wrapperRef = useClickOutside(() => setOpen(false));
  const cacheRef = useRef(new Map());

  const debouncedFetch = useMemo(
    () =>
      debounce(async (q) => {
        if (q.length < minChars) {
          setOptions([]);
          setStatus("idle");
          return;
        }
        if (cacheRef.current.has(q)) {
          setOptions(cacheRef.current.get(q));
          setStatus("done");
          return;
        }
        setStatus("loading");
        try {
          const results = await loadOptions(q);
          cacheRef.current.set(q, results);
          setOptions(results);
          setStatus("done");
        } catch {
          setStatus("error");
        }
      }, debounceMs),
    [loadOptions, debounceMs, minChars]
  );

  useEffect(() => {
    if (open) debouncedFetch(query);
    return () => debouncedFetch.cancel();
  }, [query, open, debouncedFetch]);

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={externalError} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error: externalError, disabled, hasRightIcon: false }), "flex items-center justify-between text-left")}
        >
          <span className={cn("truncate", !selectedLabel && "text-neutral-400")}>{selectedLabel || placeholder}</span>
          <ChevronIcon className={cn(sizeStyles[size].icon, "text-neutral-400 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={true} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            <div className="p-1.5 border-b border-neutral-100 relative">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full h-8 pl-2 pr-7 text-sm rounded-md border border-neutral-200 outline-none focus:border-brand-500"
              />
              {status === "loading" && <Spinner size="sm" className="absolute right-3.5 top-1/2 -translate-y-1/2" />}
            </div>
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {status === "idle" && query.length < minChars && (
                <li className="px-3 py-3 text-sm text-neutral-400 text-center">
                  Type at least {minChars} character{minChars > 1 ? "s" : ""}...
                </li>
              )}
              {status === "error" && (
                <li className="px-3 py-3 text-sm text-danger-500 text-center">Couldn't load results. Try again.</li>
              )}
              {status === "done" && options.length === 0 && (
                <li className="px-3 py-3 text-sm text-neutral-400 text-center">No matches found</li>
              )}
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected === opt.value}
                    onClick={() => {
                      setSelected(opt.value);
                      setSelectedLabel(opt.label);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-neutral-50",
                      selected === opt.value && "bg-brand-50 text-brand-700 font-medium"
                    )}
                  >
                    <span className="flex-1 truncate">
                      {opt.label}
                      {opt.description && <span className="block text-xs text-neutral-400">{opt.description}</span>}
                    </span>
                    {selected === opt.value && <CheckIcon className="size-4 shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}
