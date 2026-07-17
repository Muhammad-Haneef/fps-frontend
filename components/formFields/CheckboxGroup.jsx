"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import Checkbox from "./Checkbox";

/**
 * CheckboxGroup — multiple checkboxes that share a single array value.
 *
 * `options`: [{ value, label, description, disabled }]
 *
 * Features:
 * - Built-in "Select all" checkbox with indeterminate state
 * - min/max selection enforcement with inline hint
 * - List or card layout, horizontal or vertical
 */
export default function CheckboxGroup({
  id,
  label,
  description,
  error,
  required,
  disabled,
  options = [],
  value,
  defaultValue = [],
  onChange,
  showSelectAll = false,
  min,
  max,
  variant = "list",
  orientation = "vertical",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });

  function toggle(val) {
    const isSelected = selected.includes(val);
    if (isSelected) {
      if (typeof min === "number" && selected.length <= min) return;
      setSelected(selected.filter((v) => v !== val));
    } else {
      if (typeof max === "number" && selected.length >= max) return;
      setSelected([...selected, val]);
    }
  }

  const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value);
  const allSelected = enabledValues.length > 0 && enabledValues.every((v) => selected.includes(v));
  const someSelected = enabledValues.some((v) => selected.includes(v));

  function toggleAll() {
    if (allSelected) setSelected(selected.filter((v) => !enabledValues.includes(v)));
    else setSelected([...new Set([...selected, ...enabledValues])]);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      {showSelectAll && (
        <>
          <Checkbox
            label="Select all"
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={toggleAll}
            disabled={disabled}
          />
          <div className="border-t border-neutral-100 my-1" />
        </>
      )}
      <div className={cn("flex gap-3", orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col")}>
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={selected.includes(opt.value)}
            disabled={disabled || opt.disabled}
            variant={variant === "card" ? "card" : "default"}
            onChange={() => toggle(opt.value)}
          />
        ))}
      </div>
      {(typeof min === "number" || typeof max === "number") && (
        <p className="text-xs text-neutral-400">
          {selected.length} selected
          {typeof min === "number" && ` · min ${min}`}
          {typeof max === "number" && ` · max ${max}`}
        </p>
      )}
    </FieldWrapper>
  );
}
