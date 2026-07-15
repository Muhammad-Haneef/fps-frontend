"use client";

import { Loader2 } from "lucide-react";

export default function SubmitButton({
  label = "Submit",
  isSubmitting = false,
  className = "",
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      aria-disabled={isSubmitting}
      className={`
        w-full inline-flex items-center justify-center gap-2
        py-2 px-4 rounded-md font-semibold text-black text-xs
        transition-all duration-200
        ${
          isSubmitting
            ? "bg-gray-300 cursor-not-allowed opacity-80"
            : "bg-gray-300 hover:bg-gray-200 active:scale-[0.98] cursor-pointer"
        }
        disabled:pointer-events-none
        ${className}
      `}
    >
      {isSubmitting && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      <span>{isSubmitting ? "Please wait..." : label}</span>
    </button>
  );
}