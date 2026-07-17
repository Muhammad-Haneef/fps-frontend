"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import { XIcon } from "./Select";

const DEFAULT_OPERATORS = ["+", "-", "*", "/", "(", ")"];

/**
 * FormulaBuilder — click-to-build formula/expression composer. Tokens
 * (fields, operators, literal numbers) are appended to a strip and shown
 * both as removable chips and as a plain-text preview — no expression
 * parser or evaluator included, this is purely the visual composer; feed
 * the token list to whatever evaluates formulas in your app.
 *
 * `fields`: `[{ key, label }]` — the variables available to insert.
 * `value`: `[{ type: "field"|"operator"|"number", value }]`
 */
export default function FormulaBuilder({
  id,
  label,
  description,
  error,
  required,
  disabled,
  fields = [],
  operators = DEFAULT_OPERATORS,
  value,
  defaultValue = [],
  onChange,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [tokens, setTokens] = useControllableState({ value, defaultValue, onChange });
  const [numberDraft, setNumberDraft] = useState("");

  function push(token) {
    if (disabled) return;
    setTokens([...tokens, token]);
  }

  function removeAt(index) {
    setTokens(tokens.filter((_, i) => i !== index));
  }

  function removeLast() {
    setTokens(tokens.slice(0, -1));
  }

  function addNumber() {
    if (numberDraft === "" || Number.isNaN(Number(numberDraft))) return;
    push({ type: "number", value: numberDraft });
    setNumberDraft("");
  }

  const preview = tokens.map((t) => t.value).join(" ") || "—";

  const chipStyles = {
    field: "bg-brand-50 text-brand-700",
    operator: "bg-neutral-100 text-neutral-600 font-mono",
    number: "bg-success-50 text-success-700 font-mono",
  };

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div id={fieldId} className="flex flex-col gap-3">
        <div className="min-h-[3rem] rounded-[var(--radius-field)] border border-neutral-300 bg-neutral-0 p-2 flex flex-wrap items-center gap-1.5">
          {tokens.map((t, i) => (
            <span key={i} className={cn("inline-flex items-center gap-1 rounded-md pl-2 pr-1 py-0.5 text-sm", chipStyles[t.type])}>
              {t.value}
              {!disabled && (
                <button type="button" onClick={() => removeAt(i)} className="hover:bg-black/10 rounded-sm p-0.5" aria-label="Remove token">
                  <XIcon className="size-3" />
                </button>
              )}
            </span>
          ))}
          {tokens.length === 0 && <span className="text-sm text-neutral-400 px-1">Build a formula below…</span>}
        </div>

        <div className="flex flex-col gap-2">
          {fields.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => push({ type: "field", value: f.key, label: f.label })}
                  className="text-xs font-medium rounded-md bg-brand-50 text-brand-700 px-2.5 py-1 hover:bg-brand-100 disabled:opacity-50"
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {operators.map((op) => (
              <button
                key={op}
                type="button"
                disabled={disabled}
                onClick={() => push({ type: "operator", value: op })}
                className="size-8 flex items-center justify-center text-sm font-mono rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50"
              >
                {op}
              </button>
            ))}

            <input
              type="number"
              value={numberDraft}
              disabled={disabled}
              placeholder="Number"
              onChange={(e) => setNumberDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNumber())}
              className="w-24 h-8 px-2 text-sm rounded-md border border-neutral-300 outline-none focus:border-brand-500"
            />
            <button
              type="button"
              disabled={disabled || numberDraft === ""}
              onClick={addNumber}
              className="h-8 px-2.5 text-xs font-medium rounded-md bg-success-50 text-success-700 hover:bg-success-100 disabled:opacity-50"
            >
              Add
            </button>

            <button
              type="button"
              disabled={disabled || tokens.length === 0}
              onClick={removeLast}
              className="h-8 px-2.5 text-xs font-medium text-neutral-400 hover:text-danger-600 disabled:opacity-40 ml-auto"
            >
              Undo last
            </button>
          </div>
        </div>

        <div className="rounded-md bg-neutral-50 px-3 py-2 text-sm font-mono text-neutral-700 overflow-x-auto whitespace-nowrap">
          {preview}
        </div>
      </div>
    </FieldWrapper>
  );
}
