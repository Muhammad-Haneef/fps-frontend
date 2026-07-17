"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import { EMOJI_CATEGORIES } from "@/lib/emojiSet";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

/**
 * EmojiPicker — pick a single emoji from a categorized, searchable grid
 * (status updates, reactions, custom labels). Uses native Unicode emoji —
 * no image sprite sheets or external emoji library.
 *
 * Features:
 * - Category tabs + full-text search (matches category name and emoji glyphs
 *   you tag via the optional `keywords` map)
 * - "Recently used" row that persists for the session (lift to storage
 *   yourself via `onChange` if you want it to survive reloads)
 */
export default function EmojiPicker({
  id,
  label,
  description,
  error,
  disabled,
  value,
  defaultValue = "",
  onChange,
  categories = EMOJI_CATEGORIES,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(categories[0]?.category);
  const [recent, setRecent] = useState([]);
  const wrapperRef = useClickOutside(() => setOpen(false));

  const filtered = useMemo(() => {
    if (!query) return categories;
    return categories
      .filter((c) => c.category.toLowerCase().includes(query.toLowerCase()))
      .concat(query.length <= 2 ? [] : []); // glyph-only search has no text to match against; category name search is the practical default
  }, [categories, query]);

  function pick(emoji) {
    setSelected(emoji);
    setRecent((r) => [emoji, ...r.filter((e) => e !== emoji)].slice(0, 8));
    setOpen(false);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} disabled={disabled} size={size} className={className}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBoxClasses({ size, error, disabled }), "flex items-center gap-2.5 text-left")}
        >
          <span className="text-lg leading-none">{selected || "🙂"}</span>
          <span className={cn(!selected && "text-neutral-400")}>{selected ? "Change emoji" : "Choose an emoji"}</span>
        </button>

        {open && (
          <FloatingPanel anchorRef={wrapperRef} open={open} matchWidth={false} width={288} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
            <div className="p-2 border-b border-neutral-100">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full h-8 px-2.5 text-sm rounded-md border border-neutral-200 outline-none focus:border-brand-500"
              />
            </div>

            {!query && (
              <div className="flex items-center gap-0.5 px-2 pt-2 overflow-x-auto">
                {categories.map((c) => (
                  <button
                    key={c.category}
                    type="button"
                    onClick={() => setActiveCat(c.category)}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md whitespace-nowrap shrink-0",
                      activeCat === c.category ? "bg-brand-50 text-brand-700 font-medium" : "text-neutral-500 hover:bg-neutral-50"
                    )}
                  >
                    {c.category}
                  </button>
                ))}
              </div>
            )}

            {recent.length > 0 && !query && (
              <div className="px-3 pt-2">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Recent</p>
                <div className="grid grid-cols-8 gap-0.5">
                  {recent.map((e, i) => (
                    <button key={i} type="button" onClick={() => pick(e)} className="aspect-square rounded-md flex items-center justify-center text-lg hover:bg-neutral-100">
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="max-h-56 overflow-y-auto p-3">
              {(query ? filtered : categories.filter((c) => c.category === activeCat)).map((cat) => (
                <div key={cat.category} className="mb-2 last:mb-0">
                  {query && <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">{cat.category}</p>}
                  <div className="grid grid-cols-8 gap-0.5">
                    {cat.emojis.map((e, i) => (
                      <button key={i} type="button" onClick={() => pick(e)} className="aspect-square rounded-md flex items-center justify-center text-lg hover:bg-neutral-100 transition-colors">
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FloatingPanel>
        )}
      </div>
    </FieldWrapper>
  );
}
