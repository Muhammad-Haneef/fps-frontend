"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import { CheckIcon } from "./Select";

/**
 * ChipInput — pick from a fixed set of `options`, rendered as always-visible
 * pill chips (no dropdown). Unlike `TagsInput` (free-text tokens), this is a
 * closed choice list — think filter chips, interest tags, category picks.
 *
 * Features:
 * - `multiple` (default) toggles many chips on; set `false` for single-pick
 * - Selected chips show a check glyph and switch to the filled/brand style
 * - `max` caps how many can be selected in multiple mode
 * - Optional per-option `icon`
 */
export default function ChipInput({
  id,
  label,
  description,
  error,
  required,
  disabled,
  options = [], // [{ value, label, icon, disabled }]
  value,
  defaultValue,
  onChange,
  multiple = true,
  max,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue: defaultValue ?? (multiple ? [] : null),
    onChange,
  });

  const selectedList = multiple ? selected || [] : selected ? [selected] : [];
  const atMax = multiple && typeof max === "number" && selectedList.length >= max;

  function toggle(opt) {
    if (opt.disabled || disabled) return;
    if (!multiple) {
      setSelected(selected === opt.value ? null : opt.value);
      return;
    }
    const isSelected = selectedList.includes(opt.value);
    if (isSelected) {
      setSelected(selectedList.filter((v) => v !== opt.value));
    } else {
      if (atMax) return;
      setSelected([...selectedList, opt.value]);
    }
  }

  const chipSize = { sm: "h-7 text-xs px-2.5 gap-1", md: "h-8 text-sm px-3 gap-1.5", lg: "h-10 text-sm px-4 gap-1.5" }[size];
  const iconSize = { sm: "size-3", md: "size-3.5", lg: "size-4" }[size];

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div id={fieldId} role={multiple ? "group" : "radiogroup"} className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedList.includes(opt.value);
          const isDisabled = disabled || opt.disabled || (!isSelected && atMax);
          return (
            <button
              key={opt.value}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => toggle(opt)}
              className={cn(
                chipSize,
                "inline-flex items-center rounded-full border font-medium transition-all duration-150 outline-none",
                "focus-visible:ring-4 focus-visible:ring-brand-100",
                isSelected
                  ? "bg-brand-500 border-brand-500 text-white"
                  : "bg-neutral-0 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
                isDisabled && "opacity-50 cursor-not-allowed hover:border-neutral-300 hover:bg-neutral-0"
              )}
            >
              {isSelected ? (
                <CheckIcon className={iconSize} />
              ) : opt.icon ? (
                <span className={iconSize}>{opt.icon}</span>
              ) : null}
              {opt.label}
            </button>
          );
        })}
      </div>
      {multiple && typeof max === "number" && (
        <p className="text-xs text-neutral-400">
          {selectedList.length}/{max} selected
        </p>
      )}
    </FieldWrapper>
  );
}
