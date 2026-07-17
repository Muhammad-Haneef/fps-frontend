"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { fieldBoxClasses } from "./FieldWrapper";
import Repeater from "./Repeater";

/**
 * KeyValueInput — dynamic list of `{ key, value }` pairs (env vars, HTTP
 * headers, custom metadata). Built on top of `Repeater` for add/remove/
 * reorder; adds duplicate-key detection on top.
 */
export default function KeyValueInput({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = [{ key: "", value: "" }],
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  addLabel = "Add row",
  allowDuplicateKeys = false,
  max,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [pairs, setPairs] = useControllableState({ value, defaultValue, onChange });

  const duplicateKeys = useMemo(() => {
    if (allowDuplicateKeys) return new Set();
    const seen = new Map();
    pairs.forEach((p) => {
      const k = p.key.trim();
      if (!k) return;
      seen.set(k, (seen.get(k) || 0) + 1);
    });
    return new Set(Array.from(seen.entries()).filter(([, count]) => count > 1).map(([k]) => k));
  }, [pairs, allowDuplicateKeys]);

  return (
    <Repeater
      id={fieldId}
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      value={pairs}
      onChange={setPairs}
      createItem={() => ({ key: "", value: "" })}
      itemLabel={(index) => pairs[index]?.key || `Row ${index + 1}`}
      addLabel={addLabel}
      max={max}
      className={className}
      renderItem={({ item, update }) => {
        const isDuplicate = item.key.trim() && duplicateKeys.has(item.key.trim());
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                value={item.key}
                disabled={disabled}
                placeholder={keyPlaceholder}
                onChange={(e) => update({ key: e.target.value })}
                className={cn(fieldBoxClasses({ size: "md", error: isDuplicate, disabled }), "font-mono flex-1")}
              />
              <span className="text-neutral-300">=</span>
              <input
                value={item.value}
                disabled={disabled}
                placeholder={valuePlaceholder}
                onChange={(e) => update({ value: e.target.value })}
                className={cn(fieldBoxClasses({ size: "md", disabled }), "font-mono flex-1")}
              />
            </div>
            {isDuplicate && <p className="text-xs text-danger-600">Duplicate key</p>}
          </div>
        );
      }}
    />
  );
}
