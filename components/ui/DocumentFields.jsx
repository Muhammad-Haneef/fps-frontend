"use client";

/**
 * DocumentFields — generic layout building blocks for document-style editors
 * (quotations, invoices, contracts, etc). Kept in components/ui, like every
 * other shared primitive in the app, so any future document module can reuse
 * them instead of re-inventing the same row/section/action patterns.
 *
 * Visuals are unchanged from the original quotation editor — only the
 * location moved and the icon now comes from the shared ICONS registry.
 */

import { cn } from "@/lib/utils";
import { ICONS } from "@/constants/icons";

/** Label-left / value-right row, matching a document's field layout. */
export function DocRow({ label, required, width = "w-36", children, className }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6", className)}>
      {label && (
        <div className={cn(width, "shrink-0 pt-0.5")}>
          <span className="text-sm font-semibold text-neutral-800 border-b border-dotted border-neutral-400 pb-1 inline-block">
            {label}
            {required && <span className="text-danger-500 ml-0.5">*</span>}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/** Section card with a dotted-underline heading and an optional remove (×). */
export function Section({ title, subtitle, action, onRemove, children, className, bodyClassName }) {
  return (
    <section className={cn("rounded-xl bg-neutral-50 border border-neutral-100 p-4 sm:p-5", className)}>
      {(title || action || onRemove) && (
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {title && (
              <h3 className="text-[15px] font-bold text-neutral-900 border-b border-dotted border-neutral-400 inline-block pb-0.5">
                {title}
                {subtitle && <span className="ml-2 text-xs font-normal text-neutral-400">{subtitle}</span>}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {action}
            {onRemove && (
              <button type="button" onClick={onRemove} aria-label="Remove section" className="text-brand-500 hover:text-danger-600">
                <ICONS.x className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** Small dashed-border "ghost" action button, used for Upload Image / Add New Line / Add Signature, etc. */
export function DashedButton({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Inline text-style action link (icon optional). */
export function LinkAction({ children, icon, className, ...rest }) {
  return (
    <button
      type="button"
      className={cn("inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-brand-600", className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

/** Tiny icon-only button used in repeater row toolbars (move / duplicate / remove / collapse). */
export function IconRowButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
