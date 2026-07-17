"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/hooks";

/**
 * FloatingPanel — portals its children to <body> and pins them to
 * `anchorRef`'s position, computed with getBoundingClientRect().
 *
 * Why: every dropdown/popover in this library (Select, Combobox, DatePicker,
 * Cascader, ColorPicker, etc.) used to render its panel as a plain
 * `absolute` child of a `position: relative` wrapper. That breaks the
 * moment the field sits inside anything with `overflow: hidden/auto`
 * (a card, a table cell, a modal) — the panel gets visually clipped.
 *
 * Portaling to <body> sidesteps ancestor overflow/stacking entirely, no
 * external positioning library required. It recalculates on open, on
 * scroll (capture phase, so it catches scrolling in any ancestor), and on
 * resize, and flips above the anchor when there isn't room below.
 *
 * Pairs with `useClickOutside` (lib/hooks.js), which already knows to
 * ignore clicks landing inside any `[data-floating-root]` node — so
 * outside-click-to-close keeps working even though the panel now lives
 * outside the trigger's DOM subtree.
 */
export default function FloatingPanel({
  anchorRef,
  open = true,
  matchWidth = true,
  minWidth,
  width,
  align = "left", // "left" | "right"
  offset = 6,
  className,
  style,
  children,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);
  const mounted = useMounted();

  useLayoutEffect(() => {
    if (!open || !anchorRef?.current) return undefined;

    function update() {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const panelH = panel?.offsetHeight || 0;
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      const spaceBelow = viewportH - rect.bottom;
      const flip = spaceBelow < panelH + offset && rect.top > panelH + offset;

      const next = {
        position: "fixed",
        top: flip ? Math.max(8, rect.top - offset) : rect.bottom + offset,
        transform: flip ? "translateY(-100%)" : undefined,
        width: matchWidth ? rect.width : width,
        minWidth,
      };

      if (align === "right") {
        next.right = Math.max(8, viewportW - rect.right);
      } else {
        next.left = Math.max(8, rect.left);
      }

      setPos(next);
    }

    update();
    const onScroll = () => update();
    const onResize = () => update();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    // One more pass after the panel has its real height (first paint uses 0).
    const raf = requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [open, anchorRef, matchWidth, width, minWidth, align, offset]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      ref={panelRef}
      data-floating-root=""
      style={{ ...pos, zIndex: 1000, visibility: pos ? "visible" : "hidden", ...style }}
      className={cn(className)}
    >
      {children}
    </div>,
    document.body
  );
}
