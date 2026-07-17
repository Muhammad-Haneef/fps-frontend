"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import { XIcon } from "./Select";
import { PlusIcon } from "./Repeater";

/**
 * EditableTable — spreadsheet-style grid for tabular row data (line items,
 * pricing tiers, roster entries). Cells are always-editable inputs (text,
 * number, or select per `columns[].type`), not click-to-edit — consistent
 * with how the rest of this library treats inline editing.
 *
 * `columns`: `[{ key, label, type: "text"|"number"|"select", options, width }]`
 */
export default function EditableTable({
  id,
  label,
  description,
  error,
  required,
  disabled,
  columns = [],
  value,
  defaultValue = [],
  onChange,
  addLabel = "Add row",
  min = 0,
  max,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [rows, setRows] = useControllableState({ value, defaultValue, onChange });

  const atMax = typeof max === "number" && rows.length >= max;
  const atMin = rows.length <= min;

  function addRow() {
    if (atMax) return;
    const blank = {};
    columns.forEach((c) => (blank[c.key] = c.type === "select" ? c.options?.[0]?.value ?? "" : ""));
    setRows([...rows, blank]);
  }

  function removeRow(index) {
    if (atMin) return;
    setRows(rows.filter((_, i) => i !== index));
  }

  function updateCell(index, key, cellValue) {
    setRows(rows.map((r, i) => (i === index ? { ...r, [key]: cellValue } : r)));
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div id={fieldId} className="rounded-lg border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              {columns.map((col) => (
                <th key={col.key} className="px-2.5 py-2 text-left text-xs font-semibold text-neutral-600 whitespace-nowrap" style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
              <th className="w-9" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-neutral-100 last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="p-1.5">
                    {col.type === "select" ? (
                      <select
                        value={row[col.key] ?? ""}
                        disabled={disabled}
                        onChange={(e) => updateCell(index, col.key, e.target.value)}
                        className="w-full h-8 px-1.5 text-sm rounded-md border border-transparent bg-transparent outline-none hover:border-neutral-200 focus:border-brand-500 focus:bg-neutral-0"
                      >
                        {(col.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col.type === "number" ? "number" : "text"}
                        value={row[col.key] ?? ""}
                        disabled={disabled}
                        placeholder={col.placeholder}
                        onChange={(e) => updateCell(index, col.key, col.type === "number" ? e.target.valueAsNumber : e.target.value)}
                        className="w-full h-8 px-1.5 text-sm rounded-md border border-transparent bg-transparent outline-none hover:border-neutral-200 focus:border-brand-500 focus:bg-neutral-0"
                      />
                    )}
                  </td>
                ))}
                <td className="p-1.5">
                  <button
                    type="button"
                    disabled={disabled || atMin}
                    onClick={() => removeRow(index)}
                    aria-label="Remove row"
                    className="size-7 flex items-center justify-center rounded text-neutral-400 hover:text-danger-600 hover:bg-danger-50 disabled:opacity-30"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-sm text-neutral-400">
                  No rows yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        disabled={disabled || atMax}
        onClick={addRow}
        className={cn(
          "self-start text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1.5",
          (disabled || atMax) && "opacity-40 cursor-not-allowed hover:text-brand-600"
        )}
      >
        <PlusIcon className="size-4" />
        {addLabel}
      </button>
    </FieldWrapper>
  );
}
