"use client";

import { useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { markdownToHtml } from "@/lib/markdown";
import FieldWrapper from "./FieldWrapper";

const SYNTAX_ACTIONS = [
  { label: "Bold", icon: "B", wrap: "**" },
  { label: "Italic", icon: "I", wrap: "*" },
  { label: "Strikethrough", icon: "S", wrap: "~~" },
  { label: "Inline code", icon: "<>", wrap: "`" },
];

/**
 * MarkdownEditor — a plain-text markdown editor with a toolbar that inserts
 * syntax at the cursor, plus a live preview pane (side-by-side or tabbed).
 * Uses `lib/markdown.js` (zero-dependency mini parser) for the preview.
 *
 * Features:
 * - Toolbar wraps the current selection in markdown syntax (or inserts a
 *   placeholder if nothing is selected)
 * - View modes: "split" (edit + preview side by side), "edit", "preview"
 * - Tab key inserts spaces instead of moving focus out of the textarea
 * - Live word/character count
 */
export default function MarkdownEditor({
  id,
  label,
  description,
  error,
  required,
  disabled,
  placeholder = "Write markdown...",
  value,
  defaultValue = "",
  onChange,
  minHeight = 220,
  maxLength,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [text, setText] = useControllableState({ value, defaultValue, onChange });
  const [view, setView] = useState("split"); // "split" | "edit" | "preview"
  const textareaRef = useRef(null);

  const previewHtml = useMemo(() => markdownToHtml(text), [text]);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  function wrapSelection(wrapper, placeholder = "text") {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart, selectionEnd, value: v } = ta;
    const selected = v.slice(selectionStart, selectionEnd) || placeholder;
    const next = v.slice(0, selectionStart) + wrapper + selected + wrapper + v.slice(selectionEnd);
    setText(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selectionStart + wrapper.length, selectionStart + wrapper.length + selected.length);
    });
  }

  function insertPrefix(prefix) {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart, value: v } = ta;
    const lineStart = v.lastIndexOf("\n", selectionStart - 1) + 1;
    const next = v.slice(0, lineStart) + prefix + v.slice(lineStart);
    setText(next);
    requestAnimationFrame(() => ta.focus());
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const { selectionStart, selectionEnd, value: v } = ta;
      const next = v.slice(0, selectionStart) + "  " + v.slice(selectionEnd);
      setText(next);
      requestAnimationFrame(() => ta.setSelectionRange(selectionStart + 2, selectionStart + 2));
    }
  }

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      currentLength={text.length}
      hideCounter={!maxLength}
      className={className}
    >
      <div className={cn("rounded-[var(--radius-field)] border overflow-hidden", error ? "border-danger-400" : "border-neutral-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100")}>
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 p-1.5">
          <div className="flex items-center gap-0.5">
            {SYNTAX_ACTIONS.map((a) => (
              <ToolButton key={a.label} label={a.label} onClick={() => wrapSelection(a.wrap)}>{a.icon}</ToolButton>
            ))}
            <Divider />
            <ToolButton label="Bullet list" onClick={() => insertPrefix("- ")}>•</ToolButton>
            <ToolButton label="Numbered list" onClick={() => insertPrefix("1. ")}>1.</ToolButton>
            <ToolButton label="Quote" onClick={() => insertPrefix("> ")}>&rdquo;</ToolButton>
            <ToolButton label="Heading" onClick={() => insertPrefix("## ")}>H</ToolButton>
          </div>
          <div className="flex items-center gap-0.5 bg-neutral-100 rounded-md p-0.5">
            {["edit", "split", "preview"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn("px-2 py-1 text-xs rounded font-medium capitalize", view === v ? "bg-neutral-0 shadow-sm text-neutral-800" : "text-neutral-500")}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className={cn("grid", view === "split" ? "grid-cols-2 divide-x divide-neutral-100" : "grid-cols-1")} style={{ minHeight }}>
          {view !== "preview" && (
            <textarea
              ref={textareaRef}
              id={fieldId}
              value={text}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full resize-none outline-none p-3.5 text-sm font-mono text-neutral-800 bg-transparent"
              style={{ minHeight }}
            />
          )}
          {view !== "edit" && (
            <div
              className="md-preview p-3.5 text-sm overflow-y-auto text-neutral-800"
              style={{ minHeight }}
              dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-neutral-400">Nothing to preview yet.</p>' }}
            />
          )}
        </div>
      </div>
      <p className="text-xs text-neutral-400">{wordCount} words</p>
    </FieldWrapper>
  );
}

function ToolButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-7 min-w-7 px-1.5 rounded-md flex items-center justify-center text-xs font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
    >
      {children}
    </button>
  );
}
function Divider() {
  return <span className="w-px h-5 bg-neutral-200 mx-1" />;
}
