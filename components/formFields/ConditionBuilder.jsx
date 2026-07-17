"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import { XIcon } from "./Select";
import { PlusIcon } from "./Repeater";

const DEFAULT_OPERATORS = {
  text: [
    { value: "eq", label: "equals" },
    { value: "neq", label: "not equals" },
    { value: "contains", label: "contains" },
    { value: "empty", label: "is empty" },
  ],
  number: [
    { value: "eq", label: "=" },
    { value: "neq", label: "≠" },
    { value: "gt", label: ">" },
    { value: "lt", label: "<" },
    { value: "gte", label: "≥" },
    { value: "lte", label: "≤" },
  ],
  select: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is not" },
  ],
};

/**
 * ConditionBuilder — visual "if field operator value" rule list, joined by
 * a single AND/OR connector (flat list — no nested groups, which covers
 * the vast majority of real filter/automation-trigger UIs without the
 * complexity of a recursive tree editor).
 *
 * `fields`: `[{ key, label, type: "text"|"number"|"select", options }]`
 * `value`: `{ connector: "AND"|"OR", rules: [{ field, operator, value }] }`
 */
export default function ConditionBuilder({
  id,
  label,
  description,
  error,
  required,
  disabled,
  fields = [],
  operators = DEFAULT_OPERATORS,
  value,
  defaultValue,
  onChange,
  max,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const firstField = fields[0];
  const emptyRule = () => ({
    field: firstField?.key,
    operator: operators[firstField?.type || "text"]?.[0]?.value,
    value: "",
  });
  const [state, setState] = useControllableState({
    value,
    defaultValue: defaultValue ?? { connector: "AND", rules: [emptyRule()] },
    onChange,
  });
  const { connector, rules } = state;

  const atMax = typeof max === "number" && rules.length >= max;

  function fieldFor(key) {
    return fields.find((f) => f.key === key) || fields[0];
  }

  function updateRule(index, patch) {
    setState({ ...state, rules: rules.map((r, i) => (i === index ? { ...r, ...patch } : r)) });
  }

  function setFieldForRule(index, key) {
    const f = fieldFor(key);
    updateRule(index, { field: key, operator: operators[f?.type || "text"]?.[0]?.value, value: "" });
  }

  function addRule() {
    if (atMax) return;
    setState({ ...state, rules: [...rules, emptyRule()] });
  }

  function removeRule(index) {
    setState({ ...state, rules: rules.filter((_, i) => i !== index) });
  }

  function setConnector(next) {
    setState({ ...state, connector: next });
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div id={fieldId} className="flex flex-col gap-2">
        {rules.map((rule, index) => {
          const f = fieldFor(rule.field);
          const ops = operators[f?.type || "text"] || operators.text;
          const showValue = rule.operator !== "empty";
          return (
            <div key={index} className="flex flex-col gap-2">
              {index > 0 && (
                <div className="flex items-center gap-2 pl-1">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setConnector(connector === "AND" ? "OR" : "AND")}
                    className="text-xs font-semibold text-brand-600 bg-brand-50 rounded px-2 py-0.5 hover:bg-brand-100 disabled:opacity-50"
                  >
                    {connector}
                  </button>
                  <span className="flex-1 h-px bg-neutral-100" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <select
                  value={rule.field}
                  disabled={disabled}
                  onChange={(e) => setFieldForRule(index, e.target.value)}
                  className="h-9 px-2 text-sm rounded-md border border-neutral-300 bg-neutral-0 outline-none focus:border-brand-500 shrink-0"
                >
                  {fields.map((fl) => (
                    <option key={fl.key} value={fl.key}>{fl.label}</option>
                  ))}
                </select>

                <select
                  value={rule.operator}
                  disabled={disabled}
                  onChange={(e) => updateRule(index, { operator: e.target.value })}
                  className="h-9 px-2 text-sm rounded-md border border-neutral-300 bg-neutral-0 outline-none focus:border-brand-500 shrink-0"
                >
                  {ops.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>

                {showValue &&
                  (f?.type === "select" ? (
                    <select
                      value={rule.value}
                      disabled={disabled}
                      onChange={(e) => updateRule(index, { value: e.target.value })}
                      className="h-9 px-2 text-sm rounded-md border border-neutral-300 bg-neutral-0 outline-none focus:border-brand-500 flex-1 min-w-0"
                    >
                      {(f.options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f?.type === "number" ? "number" : "text"}
                      value={rule.value}
                      disabled={disabled}
                      onChange={(e) => updateRule(index, { value: e.target.value })}
                      className="h-9 px-2.5 text-sm rounded-md border border-neutral-300 bg-neutral-0 outline-none focus:border-brand-500 flex-1 min-w-0"
                    />
                  ))}

                <button
                  type="button"
                  disabled={disabled || rules.length <= 1}
                  onClick={() => removeRule(index)}
                  aria-label="Remove condition"
                  className="size-8 flex items-center justify-center rounded text-neutral-400 hover:text-danger-600 hover:bg-danger-50 disabled:opacity-30 shrink-0"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          disabled={disabled || atMax}
          onClick={addRule}
          className={cn(
            "self-start text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1.5 mt-1",
            (disabled || atMax) && "opacity-40 cursor-not-allowed hover:text-brand-600"
          )}
        >
          <PlusIcon className="size-4" />
          Add condition
        </button>
      </div>
    </FieldWrapper>
  );
}

export { DEFAULT_OPERATORS };
