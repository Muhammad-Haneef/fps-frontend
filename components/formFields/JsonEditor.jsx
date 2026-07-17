"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { highlightCode } from "@/lib/syntaxHighlight";
import FieldWrapper from "./FieldWrapper";
import CodeEditor from "./CodeEditor";

/**
 * JsonEditor — a JSON-focused editor built on CodeEditor, adding live
 * parse validation (with line/column error location), a one-click
 * "Format" (pretty-print) action, and a read-only collapsible tree view
 * for inspecting the parsed structure.
 *
 * Features:
 * - Validates on every change; shows exact error position when invalid
 * - Format button re-indents with configurable spacing
 * - Tree/Code view toggle — tree view renders collapsible key/value nodes
 */
export default function JsonEditor({
  id,
  label,
  description,
  error: externalError,
  required,
  disabled,
  value,
  defaultValue = "{}",
  onChange,
  indent = 2,
  minHeight = 260,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [text, setText] = useControllableState({ value, defaultValue, onChange });
  const [view, setView] = useState("code"); // "code" | "tree"

  const { parsed, parseError } = useMemo(() => {
    if (text.trim() === "") return { parsed: undefined, parseError: null };
    try {
      return { parsed: JSON.parse(text), parseError: null };
    } catch (e) {
      return { parsed: undefined, parseError: e.message };
    }
  }, [text]);

  function handleFormat() {
    try {
      const obj = JSON.parse(text);
      setText(JSON.stringify(obj, null, indent));
    } catch {
      /* leave as-is if invalid */
    }
  }

  function handleMinify() {
    try {
      const obj = JSON.parse(text);
      setText(JSON.stringify(obj));
    } catch {
      /* ignore */
    }
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={externalError || (parseError ? `Invalid JSON: ${parseError}` : undefined)} required={required} disabled={disabled} className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5 bg-neutral-100 rounded-md p-0.5">
          {["code", "tree"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              disabled={v === "tree" && parseError}
              className={cn("px-2.5 py-1 text-xs rounded font-medium capitalize disabled:opacity-40", view === v ? "bg-neutral-0 shadow-sm text-neutral-800" : "text-neutral-500")}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleFormat} className="text-xs text-brand-600 hover:underline">Format</button>
          <button type="button" onClick={handleMinify} className="text-xs text-neutral-400 hover:underline">Minify</button>
        </div>
      </div>

      {view === "code" ? (
        <CodeEditor id={fieldId} value={text} onChange={setText} language="json" showLanguageSelector={false} minHeight={minHeight} disabled={disabled} />
      ) : (
        <div className="rounded-[var(--radius-field)] border border-neutral-200 bg-neutral-950 p-3.5 font-mono text-sm overflow-auto text-neutral-100" style={{ minHeight }}>
          <JsonTree data={parsed} />
        </div>
      )}
    </FieldWrapper>
  );
}

function JsonTree({ data, keyName, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const isObject = data !== null && typeof data === "object";

  if (!isObject) {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="flex gap-1">
        {keyName !== undefined && <span className="text-danger-400">"{keyName}"</span>}
        {keyName !== undefined && <span className="text-neutral-500">:</span>}
        <ValueDisplay value={data} />
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray ? data.map((v, i) => [i, v]) : Object.entries(data);
  const bracket = isArray ? ["[", "]"] : ["{", "}"];

  return (
    <div>
      <div style={{ paddingLeft: depth * 16 }} className="flex items-center gap-1 cursor-pointer select-none" onClick={() => setCollapsed((c) => !c)}>
        <span className="text-neutral-500 text-[10px] w-3 inline-block">{collapsed ? "▶" : "▼"}</span>
        {keyName !== undefined && <span className="text-danger-400">"{keyName}"</span>}
        {keyName !== undefined && <span className="text-neutral-500">:</span>}
        <span className="text-neutral-400">{bracket[0]}{collapsed && `...${bracket[1]}`}</span>
        {!collapsed && entries.length === 0 && <span className="text-neutral-400">{bracket[1]}</span>}
      </div>
      {!collapsed && entries.map(([k, v]) => (
        <JsonTree key={k} data={v} keyName={isArray ? undefined : k} depth={depth + 1} />
      ))}
      {!collapsed && entries.length > 0 && <div style={{ paddingLeft: depth * 16 }} className="text-neutral-400">{bracket[1]}</div>}
    </div>
  );
}

function ValueDisplay({ value }) {
  if (typeof value === "string") return <span className="text-success-400">"{value}"</span>;
  if (typeof value === "number") return <span className="text-warning-400">{value}</span>;
  if (typeof value === "boolean") return <span className="text-brand-400">{String(value)}</span>;
  if (value === null) return <span className="text-neutral-500">null</span>;
  return <span>{String(value)}</span>;
}
