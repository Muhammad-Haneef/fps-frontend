"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import { XIcon } from "./Select";

/**
 * Repeater — generic "add another" list for repeated field groups (e.g.
 * work experience entries, product variants, invoice line items). You own
 * the shape of each item; this component owns add/remove/reorder.
 *
 * `renderItem({ item, index, update, remove })` renders one item's fields —
 * call `update(patch)` to merge changes into that item.
 *
 * Features:
 * - Up/down reorder buttons (keyboard-accessible — no drag library)
 * - `min`/`max` item count, `createItem()` factory for new rows
 * - Per-item numbered header with a remove (×) button
 */
export default function Repeater({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = [],
  onChange,
  renderItem,
  createItem = () => ({}),
  itemLabel = (index) => `Item ${index + 1}`,
  addLabel = "Add another",
  min = 0,
  max,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [items, setItems] = useControllableState({ value, defaultValue, onChange });

  const atMax = typeof max === "number" && items.length >= max;
  const atMin = items.length <= min;

  function addItem() {
    if (atMax) return;
    setItems([...items, createItem(items.length)]);
  }

  function removeItem(index) {
    if (atMin) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index, patch) {
    setItems(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function move(index, dir) {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[index], next[to]] = [next[to], next[index]];
    setItems(next);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div id={fieldId} className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-neutral-200 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-600">{itemLabel(index)}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                  aria-label="Move up"
                  className="size-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowIcon dir="up" />
                </button>
                <button
                  type="button"
                  disabled={disabled || index === items.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label="Move down"
                  className="size-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowIcon dir="down" />
                </button>
                <button
                  type="button"
                  disabled={disabled || atMin}
                  onClick={() => removeItem(index)}
                  aria-label="Remove"
                  className="size-6 flex items-center justify-center rounded text-neutral-400 hover:text-danger-600 hover:bg-danger-50 disabled:opacity-30"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="p-3">
              {renderItem({ item, index, update: (patch) => updateItem(index, patch), remove: () => removeItem(index) })}
            </div>
          </div>
        ))}

        {items.length === 0 && <p className="text-sm text-neutral-400 text-center py-4 border border-dashed border-neutral-200 rounded-lg">No items yet</p>}

        <button
          type="button"
          disabled={disabled || atMax}
          onClick={addItem}
          className={cn(
            "self-start text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1.5",
            (disabled || atMax) && "opacity-40 cursor-not-allowed hover:text-brand-600"
          )}
        >
          <PlusIcon className="size-4" />
          {addLabel}
        </button>
      </div>
    </FieldWrapper>
  );
}

function ArrowIcon({ dir }) {
  // Base path points up; rotate 180 for "down".
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={cn("size-3.5", dir === "down" && "rotate-180")}>
      <path fillRule="evenodd" d="M10 15.5a.75.75 0 0 1-.75-.75V6.56L6.53 9.28a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 1 1-1.06 1.06L10.75 6.56v8.19a.75.75 0 0 1-.75.75Z" clipRule="evenodd" />
    </svg>
  );
}

export function PlusIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 4.25a.75.75 0 0 1 .75.75v4.25H15a.75.75 0 0 1 0 1.5h-4.25V15a.75.75 0 0 1-1.5 0v-4.25H5a.75.75 0 0 1 0-1.5h4.25V5a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
}
