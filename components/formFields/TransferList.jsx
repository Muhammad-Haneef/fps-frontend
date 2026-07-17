"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

/**
 * TransferList — two side-by-side panels ("Available" / "Selected") for
 * moving items between them — common in permission assignment, playlist
 * building, column pickers.
 *
 * `items`: [{ value, label, description }] — the full universe of items.
 * `value`: array of values currently in the right ("Selected") panel.
 *
 * Features:
 * - Per-item checkboxes + click-row-to-toggle-check, then move with arrow buttons
 * - Double-click an item to move it instantly
 * - Search box per panel
 * - Move-all / clear-all shortcuts
 * - Item counts in each panel header
 */
export default function TransferList({
  id,
  label,
  description,
  error,
  items = [],
  value,
  defaultValue = [],
  onChange,
  titles = ["Available", "Selected"],
  height = 280,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selectedValues, setSelectedValues] = useControllableState({ value, defaultValue, onChange });
  const [leftChecked, setLeftChecked] = useState([]);
  const [rightChecked, setRightChecked] = useState([]);
  const [leftQuery, setLeftQuery] = useState("");
  const [rightQuery, setRightQuery] = useState("");

  const leftItems = items.filter((i) => !selectedValues.includes(i.value) && i.label.toLowerCase().includes(leftQuery.toLowerCase()));
  const rightItems = items.filter((i) => selectedValues.includes(i.value) && i.label.toLowerCase().includes(rightQuery.toLowerCase()));

  function toggleCheck(list, setList, value) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function moveRight() {
    setSelectedValues([...selectedValues, ...leftChecked]);
    setLeftChecked([]);
  }
  function moveLeft() {
    setSelectedValues(selectedValues.filter((v) => !rightChecked.includes(v)));
    setRightChecked([]);
  }
  function moveAllRight() {
    setSelectedValues(items.map((i) => i.value));
    setLeftChecked([]);
  }
  function moveAllLeft() {
    setSelectedValues([]);
    setRightChecked([]);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} className={className}>
      <div className="flex items-stretch gap-2">
        <Panel
          title={titles[0]}
          items={leftItems}
          checked={leftChecked}
          onToggle={(v) => toggleCheck(leftChecked, setLeftChecked, v)}
          onDoubleClick={(v) => setSelectedValues([...selectedValues, v])}
          query={leftQuery}
          onQuery={setLeftQuery}
          height={height}
          count={items.length - selectedValues.length}
        />

        <div className="flex flex-col justify-center gap-2 shrink-0">
          <TransferButton dir="right" onClick={moveRight} disabled={leftChecked.length === 0} />
          <TransferButton dir="left" onClick={moveLeft} disabled={rightChecked.length === 0} />
        </div>

        <Panel
          title={titles[1]}
          items={rightItems}
          checked={rightChecked}
          onToggle={(v) => toggleCheck(rightChecked, setRightChecked, v)}
          onDoubleClick={(v) => setSelectedValues(selectedValues.filter((sv) => sv !== v))}
          query={rightQuery}
          onQuery={setRightQuery}
          height={height}
          count={selectedValues.length}
        />
      </div>
      <div className="flex justify-between text-xs">
        <button type="button" onClick={moveAllRight} className="text-brand-600 hover:underline">Move all →</button>
        <button type="button" onClick={moveAllLeft} className="text-neutral-400 hover:underline">← Clear all</button>
      </div>
    </FieldWrapper>
  );
}

function Panel({ title, items, checked, onToggle, onDoubleClick, query, onQuery, height, count }) {
  return (
    <div className="flex-1 flex flex-col rounded-lg border border-neutral-200 overflow-hidden min-w-0">
      <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-600">{title}</span>
        <span className="text-xs text-neutral-400">{count}</span>
      </div>
      <div className="p-1.5 border-b border-neutral-100">
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search..."
          className="w-full h-7 px-2 text-xs rounded-md border border-neutral-200 outline-none focus:border-brand-500"
        />
      </div>
      <ul className="overflow-y-auto flex-1" style={{ height }}>
        {items.map((item) => (
          <li key={item.value}>
            <label
              onDoubleClick={() => onDoubleClick(item.value)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-neutral-50 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked.includes(item.value)}
                onChange={() => onToggle(item.value)}
                className="size-3.5 rounded border-neutral-300 text-brand-500 focus:ring-brand-200"
              />
              <span className="truncate">{item.label}</span>
            </label>
          </li>
        ))}
        {items.length === 0 && <li className="px-3 py-6 text-xs text-neutral-400 text-center">No items</li>}
      </ul>
    </div>
  );
}

function TransferButton({ dir, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-8 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-500 transition-colors",
        "hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent"
      )}
      aria-label={dir === "right" ? "Move to selected" : "Move to available"}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className={cn("size-4", dir === "left" && "rotate-180")}>
        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L11.29 6.15a.75.75 0 1 1 1.02-1.1l5 4.65a.75.75 0 0 1 0 1.1l-5 4.65a.75.75 0 1 1-1.02-1.1l3.098-3.1H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
