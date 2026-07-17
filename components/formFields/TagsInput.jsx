"use client";

import { useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import { XIcon } from "./Select";
import FloatingPanel from "./FloatingPanel";

/**
 * TagsInput — free-text tag/token entry. Type a value and press Enter (or
 * any of `separators`) to commit it as a chip; Backspace on an empty field
 * removes the last chip. The engine behind `KeywordInput`.
 *
 * Features:
 * - Configurable commit keys (`separators`, default Enter/Tab/comma)
 * - Paste support: pasting "a, b, c" splits into three chips
 * - Duplicate prevention (`caseSensitive` toggles exact vs. case-insensitive)
 * - Per-tag validation (`validate(tag) => true | string`) — invalid tags
 *   show an inline error instead of being added
 * - `max` tag limit, `maxTagLength`, optional `suggestions` autocomplete
 */
export default function TagsInput({
  id,
  label,
  description,
  error,
  required,
  disabled,
  placeholder = "Add a tag…",
  value,
  defaultValue = [],
  onChange,
  separators = ["Enter", "Tab", ","],
  caseSensitive = false,
  validate,
  transform, // (raw: string) => string, applied before adding
  max,
  maxTagLength,
  suggestions,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [tags, setTags] = useControllableState({ value, defaultValue, onChange });
  const [input, setInput] = useState("");
  const [localError, setLocalError] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const wrapperRef = useClickOutside(() => setOpen(false));

  const atMax = typeof max === "number" && tags.length >= max;

  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    const q = input.trim().toLowerCase();
    return suggestions
      .filter((s) => !tags.some((t) => sameTag(t, s, caseSensitive)))
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .slice(0, 8);
  }, [suggestions, input, tags, caseSensitive]);

  function sameTag(a, b, cs) {
    return cs ? a === b : a.toLowerCase() === b.toLowerCase();
  }

  function commit(raw) {
    let next = transform ? transform(raw) : raw.trim();
    if (!next) return;
    if (maxTagLength && next.length > maxTagLength) next = next.slice(0, maxTagLength);
    if (tags.some((t) => sameTag(t, next, caseSensitive))) {
      setLocalError("Already added");
      return;
    }
    if (atMax) {
      setLocalError(`Max ${max} tags`);
      return;
    }
    if (validate) {
      const result = validate(next);
      if (result !== true) {
        setLocalError(typeof result === "string" ? result : "Invalid tag");
        return;
      }
    }
    setTags([...tags, next]);
    setInput("");
    setLocalError("");
    setActiveIndex(-1);
  }

  function removeAt(index) {
    setTags(tags.filter((_, i) => i !== index));
  }

  function handleKeyDown(e) {
    if (separators.includes(e.key)) {
      if (input.trim()) {
        e.preventDefault();
        if (open && activeIndex >= 0 && filteredSuggestions[activeIndex]) {
          commit(filteredSuggestions[activeIndex]);
        } else {
          commit(input);
        }
      }
      return;
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeAt(tags.length - 1);
      return;
    }
    if (suggestions && open && filteredSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filteredSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? filteredSuggestions.length - 1 : i - 1));
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text");
    if (!/[,;\n\t]/.test(text)) return;
    e.preventDefault();
    text
      .split(/[,;\n\t]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => commit(t));
  }

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      description={description}
      error={error || localError}
      required={required}
      disabled={disabled}
      size={size}
      className={className}
    >
      <div className="relative" ref={wrapperRef}>
        <div
          onClick={() => !disabled && inputRef.current?.focus()}
          className={cn(
            fieldBoxClasses({ size, error: error || localError, disabled }),
            "h-auto min-h-[var(--h)] flex flex-wrap items-center gap-1.5 py-1.5 cursor-text"
          )}
          style={{ "--h": size === "sm" ? "2rem" : size === "lg" ? "3rem" : "2.5rem" }}
        >
          {tags.map((tag, i) => (
            <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 rounded-md bg-brand-50 text-brand-700 pl-2 pr-1 py-0.5 text-xs font-medium">
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(i);
                  }}
                  className="hover:bg-brand-100 rounded-sm p-0.5"
                  aria-label={`Remove ${tag}`}
                >
                  <XIcon className="size-3" />
                </button>
              )}
            </span>
          ))}
          <input
            id={fieldId}
            ref={inputRef}
            value={input}
            disabled={disabled || atMax}
            onChange={(e) => {
              setInput(e.target.value);
              setLocalError("");
              setOpen(true);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setOpen(true)}
            placeholder={atMax ? "" : tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[100px] outline-none bg-transparent text-sm placeholder:text-neutral-400 disabled:cursor-not-allowed"
          />
        </div>

        {open && suggestions && filteredSuggestions.length > 0 && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={true} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg max-h-56 overflow-y-auto py-1">
            {filteredSuggestions.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(s)}
                  className={cn("w-full text-left px-3 py-2 text-sm hover:bg-neutral-50", i === activeIndex && "bg-neutral-50")}
                >
                  {s}
                </button>
              </li>
            ))}
          </FloatingPanel>
        )}
      </div>

      {typeof max === "number" && (
        <p className="text-xs text-neutral-400">
          {tags.length}/{max} tags
        </p>
      )}
    </FieldWrapper>
  );
}
