"use client";

import { cn } from "@/lib/utils";
import { useFormContext } from "@/lib/FormContext";
import { Spinner } from "./TextInput";

export default function FormActions({
  children,
  align = "right", // "left" | "right" | "between" | "center"
  sticky = false,
  className,
}) {
  const form = useFormContext();

  const alignClass = {
    left: "justify-start",
    right: "justify-end",
    between: "justify-between",
    center: "justify-center",
  }[align];

  return (
    <div
      className={cn(
        "flex items-center gap-3 pt-4",
        alignClass,
        sticky && "sticky bottom-0 bg-neutral-0/90 backdrop-blur border-t border-neutral-100 -mx-6 px-6 py-4",
        className
      )}
    >
      {typeof children === "function" ? children(form) : children}
    </div>
  );
}

/** Convenience primary submit button pre-wired to Form's submitting state. */
export function SubmitButton({ children = "Submit", loadingText = "Submitting...", className, ...rest }) {
  const form = useFormContext();
  const isSubmitting = form?.isSubmitting;

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-(--radius-field) bg-brand-500 text-white text-sm font-medium",
        "hover:bg-brand-600 active:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-4 focus:ring-brand-100",
        className
      )}
      {...rest}
    >
      {isSubmitting && <Spinner size="sm" className="text-white" />}
      {isSubmitting ? loadingText : children}
    </button>
  );
}

/** Convenience secondary/ghost button — e.g. Cancel, Reset. */
export function SecondaryButton({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-(--radius-field) border border-neutral-300 bg-neutral-0 text-sm font-medium text-neutral-700",
        "hover:bg-neutral-50 active:bg-neutral-100 transition-colors",
        "focus:outline-none focus:ring-4 focus:ring-neutral-100",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
