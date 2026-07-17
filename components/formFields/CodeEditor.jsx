"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { highlightCode } from "@/lib/syntaxHighlight";
import FieldWrapper from "./FieldWrapper";

const LANGUAGES = ["javascript", "typescript", "json", "css", "html", "python"];

/**
 * CodeEditor — a code-focused textarea with line numbers and lightweight
 * regex-based syntax highlighting (see `lib/syntaxHighlight.js`). Not a
 * full IDE — no external editor library — but covers the essentials:
 * proper tab handling, monospace alignment, line count, and color.
 *
 * Implementation note: uses the classic "transparent textarea over a
 * highlighted <pre>" trick, with scroll positions synced, so the caret and
 * native text-editing behavior (selection, undo, IME) stay 100% native
 * while the highlighted layer renders behind it.
 *
 * Features:
 * - Line-number gutter, current-line count in the footer
 * - Tab inserts 2 spaces (Shift+Tab removes one level), doesn't lose focus
 * - Language selector, copy-to-clipboard button
 * - Read-only mode for displaying snippets
 */
export default function CodeEditor({
  id,
  label,
  description,
  error,
  required,
  disabled,
  readOnly,
  value,
  defaultValue = "",
  onChange,
  language = "javascript",
  onLanguageChange,
  showLanguageSelector = true,
  minHeight = 240,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [code, setCode] = useControllableState({ value, defaultValue, onChange });
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const gutterRef = useRef(null);

  const lines = code.split("\n");

  function syncScroll() {
    if (preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = textareaRef.current.scrollTop;
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const { selectionStart, selectionEnd, value: v } = ta;
      if (e.shiftKey) {
        const lineStart = v.lastIndexOf("\n", selectionStart - 1) + 1;
        if (v.slice(lineStart, lineStart + 2) === "  ") {
          const next = v.slice(0, lineStart) + v.slice(lineStart + 2);
          setCode(next);
          requestAnimationFrame(() => ta.setSelectionRange(selectionStart - 2, selectionEnd - 2));
        }
      } else {
        const next = v.slice(0, selectionStart) + "  " + v.slice(selectionEnd);
        setCode(next);
        requestAnimationFrame(() => ta.setSelectionRange(selectionStart + 2, selectionStart + 2));
      }
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div className={cn("rounded-[var(--radius-field)] border overflow-hidden bg-neutral-950", error ? "border-danger-400" : "border-neutral-800")}>
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800 bg-neutral-900">
          {showLanguageSelector ? (
            <select
              value={language}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              className="bg-transparent text-xs text-neutral-400 outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l} className="bg-neutral-900">{l}</option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-neutral-400">{language}</span>
          )}
          <button type="button" onClick={handleCopy} className="text-xs text-neutral-400 hover:text-neutral-100 flex items-center gap-1">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="relative flex font-mono text-sm" style={{ minHeight }}>
          <div ref={gutterRef} className="select-none text-right px-3 py-3 text-neutral-600 bg-neutral-900/50 overflow-hidden shrink-0" style={{ lineHeight: "1.6" }}>
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <div className="relative flex-1 overflow-hidden">
            <pre
              ref={preRef}
              aria-hidden="true"
              className="absolute inset-0 m-0 px-3 py-3 overflow-auto whitespace-pre pointer-events-none text-neutral-100"
              style={{ lineHeight: "1.6" }}
              dangerouslySetInnerHTML={{ __html: highlightCode(code, language) + "\n" }}
            />
            <textarea
              ref={textareaRef}
              id={fieldId}
              value={code}
              readOnly={readOnly}
              disabled={disabled}
              spellCheck={false}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={syncScroll}
              className="absolute inset-0 w-full h-full resize-none outline-none px-3 py-3 bg-transparent text-transparent caret-neutral-100 whitespace-pre overflow-auto"
              style={{ lineHeight: "1.6" }}
            />
          </div>
        </div>

        <div className="px-3 py-1 border-t border-neutral-800 text-[10px] text-neutral-500 flex justify-between">
          <span>{lines.length} lines</span>
          <span>{code.length} characters</span>
        </div>
      </div>
    </FieldWrapper>
  );
}
