"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

const TOOLS = [
  { cmd: "bold", label: "Bold", icon: "B" },
  { cmd: "italic", label: "Italic", icon: "I" },
  { cmd: "underline", label: "Underline", icon: "U" },
  { cmd: "strikeThrough", label: "Strikethrough", icon: "S" },
];

/**
 * RichTextEditor — WYSIWYG editor built on `contentEditable` + the browser's
 * built-in editing commands. No external rich-text library.
 *
 * Features:
 * - Toolbar: bold/italic/underline/strike, H1-H3, bullet/numbered lists,
 *   blockquote, link insertion, undo/redo, clear formatting
 * - Keyboard shortcuts for the common commands (Ctrl/Cmd+B/I/U)
 * - Placeholder text when empty, live character count
 * - Outputs HTML via `onChange` (and exposes plain text via `onTextChange`)
 */
export default function RichTextEditor({
  id,
  label,
  description,
  error,
  required,
  disabled,
  placeholder = "Write something...",
  value,
  defaultValue = "",
  onChange,
  onTextChange,
  minHeight = 180,
  maxLength,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [html, setHtml] = useControllableState({ value, defaultValue, onChange });
  const editorRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!defaultValue);
  const [linkPromptOpen, setLinkPromptOpen] = useState(false);
  const linkWrapperRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html || "";
      setIsEmpty(!html);
      setCharCount(editorRef.current.textContent.length);
    }
    // eslint-disable-next-line
  }, []);

  const syncState = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    setHtml(el.innerHTML);
    setIsEmpty(el.textContent.trim() === "");
    setCharCount(el.textContent.length);
    onTextChange?.(el.textContent);
  }, [setHtml, onTextChange]);

  function exec(cmd, arg) {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    syncState();
  }

  function handleKeyDown(e) {
    if (e.metaKey || e.ctrlKey) {
      if (e.key.toLowerCase() === "b") { e.preventDefault(); exec("bold"); }
      else if (e.key.toLowerCase() === "i") { e.preventDefault(); exec("italic"); }
      else if (e.key.toLowerCase() === "u") { e.preventDefault(); exec("underline"); }
    }
  }

  function insertLink() {
    if (!linkUrl) return;
    exec("createLink", linkUrl);
    setLinkPromptOpen(false);
    setLinkUrl("");
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
      currentLength={charCount}
      hideCounter={!maxLength}
      className={className}
    >
      <div className={cn("rounded-[var(--radius-field)] border overflow-hidden", error ? "border-danger-400" : "border-neutral-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100")}>
        <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-100 bg-neutral-50 p-1.5">
          {TOOLS.map((t) => (
            <ToolButton key={t.cmd} label={t.label} onClick={() => exec(t.cmd)}>
              <span className={cn("text-sm font-bold", t.cmd === "italic" && "italic font-serif", t.cmd === "underline" && "underline", t.cmd === "strikeThrough" && "line-through")}>{t.icon}</span>
            </ToolButton>
          ))}
          <Divider />
          {[1, 2, 3].map((level) => (
            <ToolButton key={level} label={`Heading ${level}`} onClick={() => exec("formatBlock", `H${level}`)}>
              <span className="text-xs font-bold">H{level}</span>
            </ToolButton>
          ))}
          <Divider />
          <ToolButton label="Bullet list" onClick={() => exec("insertUnorderedList")}><ListIcon /></ToolButton>
          <ToolButton label="Numbered list" onClick={() => exec("insertOrderedList")}><ListOrderedIcon /></ToolButton>
          <ToolButton label="Blockquote" onClick={() => exec("formatBlock", "BLOCKQUOTE")}><QuoteIcon /></ToolButton>
          <Divider />
          <div className="relative" ref={linkWrapperRef}>
            <ToolButton label="Insert link" onClick={() => setLinkPromptOpen((o) => !o)}><LinkIcon /></ToolButton>
            {linkPromptOpen && (
              <FloatingPanel anchorRef={linkWrapperRef} open={linkPromptOpen} matchWidth={false} align="left" className="flex items-center gap-1 bg-neutral-0 border border-neutral-200 rounded-lg shadow-lg p-1.5">
                <input
                  autoFocus
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && insertLink()}
                  placeholder="https://..."
                  className="h-7 w-40 px-2 text-xs rounded-md border border-neutral-200 outline-none focus:border-brand-500"
                />
                <button type="button" onClick={insertLink} className="h-7 px-2 text-xs rounded-md bg-brand-500 text-white">Add</button>
              </FloatingPanel>
            )}
          </div>
          <Divider />
          <ToolButton label="Undo" onClick={() => exec("undo")}><UndoIcon /></ToolButton>
          <ToolButton label="Redo" onClick={() => exec("redo")}><RedoIcon /></ToolButton>
          <ToolButton label="Clear formatting" onClick={() => exec("removeFormat")}><ClearIcon /></ToolButton>
        </div>

        <div className="relative">
          {isEmpty && <span className="absolute top-3 left-3.5 text-sm text-neutral-400 pointer-events-none">{placeholder}</span>}
          <div
            ref={editorRef}
            id={fieldId}
            contentEditable={!disabled}
            suppressContentEditableWarning
            onInput={syncState}
            onKeyDown={handleKeyDown}
            onBlur={syncState}
            style={{ minHeight }}
            className={cn(
              "prose-sm max-w-none px-3.5 py-3 text-sm text-neutral-800 outline-none overflow-y-auto",
              "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:my-2",
              "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-2",
              "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:my-1.5",
              "[&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-3 [&_blockquote]:text-neutral-500",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
              "[&_a]:text-brand-600 [&_a]:underline",
              disabled && "bg-neutral-100 cursor-not-allowed"
            )}
          />
        </div>
      </div>
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
      className="size-7 rounded-md flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
    >
      {children}
    </button>
  );
}
function Divider() {
  return <span className="w-px h-5 bg-neutral-200 mx-1" />;
}
function ListIcon() { return <svg viewBox="0 0 20 20" fill="currentColor" className="size-4"><path d="M4 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM7.5 4h9v1.5h-9V4Zm0 5h9v1.5h-9V9Zm0 5h9v1.5h-9V14Z" /></svg>; }
function ListOrderedIcon() { return <svg viewBox="0 0 20 20" fill="currentColor" className="size-4"><path d="M7.5 4h9v1.5h-9V4Zm0 5h9v1.5h-9V9Zm0 5h9v1.5h-9V14ZM2.5 3.5h1v3h-1v-3Zm0 5.25h1.4L2.5 10.5v.75h2v-.75H3.1l1.4-1.75V8H2.5v.75Zm.1 5.25h1.9v.75H2.6v-.6l1.3-1.15H2.6v-.7h1.9v.6l-1.3 1.1Z" /></svg>; }
function QuoteIcon() { return <svg viewBox="0 0 20 20" fill="currentColor" className="size-4"><path d="M5 5.5C5 4.67 5.67 4 6.5 4S8 4.67 8 5.5c0 2-1.5 3.5-3.5 4l-.5-1c1.2-.4 2-1.2 2-2H5V5.5Zm7 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 2-1.5 3.5-3.5 4l-.5-1c1.2-.4 2-1.2 2-2H12V5.5Z" /></svg>; }
function LinkIcon() { return <svg viewBox="0 0 20 20" fill="currentColor" className="size-4"><path d="M8.5 11.5a.75.75 0 0 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H4a.75.75 0 0 0 0 1.5h6.22L8.5 11.5Z" /><path d="M3 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H5v10h10v-3a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Z" /></svg>; }
function UndoIcon() { return <svg viewBox="0 0 20 20" fill="currentColor" className="size-4"><path d="M7.78 3.72a.75.75 0 0 1 0 1.06L5.56 7H11a5 5 0 1 1 0 10H8a.75.75 0 0 1 0-1.5h3a3.5 3.5 0 1 0 0-7H5.56l2.22 2.22a.75.75 0 1 1-1.06 1.06L3.22 8.28a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 0Z" /></svg>; }
function RedoIcon() { return <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 -scale-x-100"><path d="M7.78 3.72a.75.75 0 0 1 0 1.06L5.56 7H11a5 5 0 1 1 0 10H8a.75.75 0 0 1 0-1.5h3a3.5 3.5 0 1 0 0-7H5.56l2.22 2.22a.75.75 0 1 1-1.06 1.06L3.22 8.28a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 0Z" /></svg>; }
function ClearIcon() { return <svg viewBox="0 0 20 20" fill="currentColor" className="size-4"><path d="M3.5 3.5 16.5 16.5M6 4h10.5a.5.5 0 0 1 .35.85L12 10l3 5H8l-4-6.5L6 4Z" fillOpacity="0.4" /></svg>; }
