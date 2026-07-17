"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import { ChevronIcon, XIcon } from "./Select";
import FloatingPanel from "./FloatingPanel";

/**
 * TreeSelect — pick from a nested hierarchy (categories, org charts, file
 * trees, permission groups) with expand/collapse and optional multi-select
 * where checking a parent auto-checks/unchecks its descendants.
 *
 * `tree`: [{ value, label, children?: [...] }]
 *
 * Features:
 * - Single or multi mode (`multiple`)
 * - Parent/child cascade selection with indeterminate parent state (multi mode)
 * - Search filters the tree, auto-expanding matching branches
 * - Selected chips display (multi mode)
 */
export default function TreeSelect({
  id,
  label,
  description,
  error,
  required,
  disabled,
  placeholder = "Select from tree",
  tree = [],
  value,
  defaultValue,
  onChange,
  multiple = false,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue: defaultValue ?? (multiple ? [] : ""),
    onChange,
  });
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [query, setQuery] = useState("");
  const wrapperRef = useClickOutside(() => setOpen(false));

  const flat = useMemo(() => flattenTree(tree), [tree]);
  const labelOf = (v) => flat.find((n) => n.value === v)?.label;

  function toggleExpand(value) {
    setExpanded((e) => ({ ...e, [value]: !e[value] }));
  }

  function getDescendantValues(node) {
    let out = [];
    for (const c of node.children || []) {
      out.push(c.value, ...getDescendantValues(c));
    }
    return out;
  }

  function handleSelect(node) {
    if (!multiple) {
      setSelected(node.value);
      setOpen(false);
      return;
    }
    const descendants = getDescendantValues(node);
    const group = [node.value, ...descendants];
    const allSelected = group.every((v) => selected.includes(v));
    if (allSelected) {
      setSelected(selected.filter((v) => !group.includes(v)));
    } else {
      setSelected([...new Set([...selected, ...group])]);
    }
  }

  function nodeCheckState(node) {
    if (!multiple) return selected === node.value;
    const descendants = getDescendantValues(node);
    const group = [node.value, ...descendants];
    const selectedCount = group.filter((v) => selected.includes(v)).length;
    if (selectedCount === 0) return "unchecked";
    if (selectedCount === group.length) return "checked";
    return "indeterminate";
  }

  function matchesQuery(node) {
    if (!query) return true;
    if (node.label.toLowerCase().includes(query.toLowerCase())) return true;
    return (node.children || []).some(matchesQuery);
  }

  const displayLabel = multiple
    ? selected.length > 0
      ? `${selected.length} selected`
      : ""
    : labelOf(selected) || "";

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error, disabled, hasRightIcon: false }), "flex items-center justify-between text-left")}
        >
          <span className={cn("truncate", !displayLabel && "text-neutral-400")}>{displayLabel || placeholder}</span>
          <ChevronIcon className={cn("size-4 text-neutral-400 transition-transform", open && "rotate-180")} />
        </button>

        {multiple && selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selected.map((v) => (
              <span key={v} className="inline-flex items-center gap-1 rounded-md bg-brand-50 text-brand-700 pl-2 pr-1 py-0.5 text-xs font-medium">
                {labelOf(v)}
                <button type="button" onClick={() => setSelected(selected.filter((s) => s !== v))} className="hover:bg-brand-100 rounded-sm p-0.5">
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={true} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            <div className="p-1.5 border-b border-neutral-100">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tree..."
                className="w-full h-8 px-2 text-sm rounded-md border border-neutral-200 outline-none focus:border-brand-500"
              />
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {tree.filter(matchesQuery).map((node) => (
                <TreeNode
                  key={node.value}
                  node={node}
                  depth={0}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  onSelect={handleSelect}
                  checkState={nodeCheckState}
                  multiple={multiple}
                  query={query}
                  matchesQuery={matchesQuery}
                />
              ))}
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

function TreeNode({ node, depth, expanded, toggleExpand, onSelect, checkState, multiple, query, matchesQuery }) {
  const hasChildren = node.children?.length > 0;
  const isOpen = query ? true : expanded[node.value];
  const state = checkState(node);

  return (
    <div>
      <div
        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-neutral-50 cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node.value);
            }}
            className="text-neutral-400 hover:text-neutral-700 shrink-0"
          >
            <ChevronIcon className={cn("size-3.5 -rotate-90 transition-transform", isOpen && "rotate-0")} />
          </button>
        ) : (
          <span className="size-3.5 shrink-0" />
        )}

        {multiple ? (
          <span
            className={cn(
              "size-4 rounded border-2 flex items-center justify-center shrink-0",
              state === "checked" ? "bg-brand-500 border-brand-500" : state === "indeterminate" ? "bg-brand-200 border-brand-300" : "border-neutral-300"
            )}
          >
            {state === "checked" && <svg viewBox="0 0 12 12" fill="none" className="size-2.5"><path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
        ) : (
          <span className={cn("size-3 rounded-full border-2 shrink-0", state ? "border-brand-500 bg-brand-500" : "border-neutral-300")} />
        )}
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && isOpen && (
        <div>
          {node.children.filter(matchesQuery).map((child) => (
            <TreeNode
              key={child.value}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggleExpand={toggleExpand}
              onSelect={onSelect}
              checkState={checkState}
              multiple={multiple}
              query={query}
              matchesQuery={matchesQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function flattenTree(nodes) {
  let out = [];
  for (const n of nodes) {
    out.push(n);
    if (n.children) out = out.concat(flattenTree(n.children));
  }
  return out;
}
