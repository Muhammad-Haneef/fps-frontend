"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import { ChevronIcon, CheckIcon } from "./Select";
import FloatingPanel from "./FloatingPanel";

/**
 * Cascader — select a value by drilling through dependent levels
 * (e.g. Category → Subcategory → Product, or Country → State → City),
 * shown as side-by-side panels like macOS Finder's column view.
 *
 * `options`: [{ value, label, children?: [...] }]
 *
 * Features:
 * - Multi-column panel that opens the next level the instant a parent is picked
 * - Breadcrumb trail of the current path shown in the trigger
 * - Keyboard-friendly: click-through, or use with a mouse for the classic UX
 */
export default function Cascader({
  id,
  label,
  description,
  error,
  required,
  disabled,
  placeholder = "Please select",
  options = [],
  value, // array path, e.g. ["us", "ca", "sf"]
  defaultValue = [],
  onChange,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [path, setPath] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const wrapperRef = useClickOutside(() => setOpen(false));

  // Build the list of columns to render based on the currently selected path.
  const columns = [];
  let currentLevel = options;
  for (let i = 0; i <= path.length; i++) {
    if (!currentLevel || currentLevel.length === 0) break;
    columns.push(currentLevel);
    const selectedNode = currentLevel.find((n) => n.value === path[i]);
    currentLevel = selectedNode?.children;
  }

  function handlePick(colIndex, node) {
    const newPath = [...path.slice(0, colIndex), node.value];
    setPath(newPath);
    if (!node.children || node.children.length === 0) setOpen(false);
  }

  function labelsForPath() {
    let labels = [];
    let level = options;
    for (const v of path) {
      const node = level?.find((n) => n.value === v);
      if (!node) break;
      labels.push(node.label);
      level = node.children;
    }
    return labels;
  }

  const displayLabels = labelsForPath();

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error, disabled, hasRightIcon: false }), "flex items-center justify-between text-left")}
        >
          <span className={cn("truncate", displayLabels.length === 0 && "text-neutral-400")}>
            {displayLabels.length > 0 ? displayLabels.join(" / ") : placeholder}
          </span>
          <ChevronIcon className={cn("size-4 text-neutral-400 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} className="flex rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            {columns.map((col, colIndex) => (
              <ul key={colIndex} role="listbox" className="w-48 max-h-72 overflow-y-auto py-1 border-r border-neutral-100 last:border-r-0">
                {col.map((node) => {
                  const active = path[colIndex] === node.value;
                  const hasChildren = node.children?.length > 0;
                  return (
                    <li key={node.value}>
                      <button
                        type="button"
                        onClick={() => handlePick(colIndex, node)}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left",
                          active ? "bg-brand-50 text-brand-700 font-medium" : "hover:bg-neutral-50"
                        )}
                      >
                        <span className="truncate">{node.label}</span>
                        {hasChildren ? (
                          <ChevronIcon className="size-3.5 -rotate-90 text-neutral-400 shrink-0" />
                        ) : (
                          active && <CheckIcon className="size-3.5 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ))}
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}
