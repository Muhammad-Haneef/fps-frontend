"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { ICON_CATEGORIES } from "@/lib/iconSet";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

/**
 * IconPicker — pick a named icon from a curated built-in set (organized by
 * category, searchable). Selecting stores the icon's `name` string — render
 * it yourself with `<IconGlyph name={value} />` wherever you display it
 * (e.g. next to a category or nav item).
 *
 * Bring-your-own-icon-set: pass `icons` (same shape as ICON_CATEGORIES) to
 * swap in your product's actual icon library instead of the built-in demo set.
 */
export default function IconPicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = "",
  onChange,
  icons = ICON_CATEGORIES,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useClickOutside(() => setOpen(false));

  const filtered = useMemo(() => {
    if (!query) return icons;
    return icons
      .map((cat) => ({ ...cat, icons: cat.icons.filter((i) => i.name.includes(query.toLowerCase())) }))
      .filter((cat) => cat.icons.length > 0);
  }, [icons, query]);

  const selectedIcon = icons.flatMap((c) => c.icons).find((i) => i.name === selected);

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error, disabled }), "flex items-center gap-2.5 text-left")}
        >
          {selectedIcon ? (
            <>
              <IconGlyph path={selectedIcon.path} className="size-4 text-neutral-600" />
              <span className="text-neutral-700 capitalize">{selectedIcon.name.replace("-", " ")}</span>
            </>
          ) : (
            <span className="text-neutral-400">Choose an icon</span>
          )}
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} width={288} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            <div className="p-2 border-b border-neutral-100">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons..."
                className="w-full h-8 px-2.5 text-sm rounded-md border border-neutral-200 outline-none focus:border-brand-500"
              />
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.map((cat) => (
                <div key={cat.category} className="mb-2 last:mb-0">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide px-1 mb-1">{cat.category}</p>
                  <div className="grid grid-cols-6 gap-1">
                    {cat.icons.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        title={icon.name}
                        onClick={() => {
                          setSelected(icon.name);
                          setOpen(false);
                        }}
                        className={cn(
                          "aspect-square rounded-md flex items-center justify-center transition-colors",
                          selected === icon.name ? "bg-brand-500 text-white" : "text-neutral-600 hover:bg-neutral-100"
                        )}
                      >
                        <IconGlyph path={icon.path} className="size-4" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-sm text-neutral-400 text-center py-6">No icons found</p>}
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}

/** Renders a single icon glyph from the icon set's `path` data — reuse this to display a chosen icon elsewhere in your app. */
export function IconGlyph({ path, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
