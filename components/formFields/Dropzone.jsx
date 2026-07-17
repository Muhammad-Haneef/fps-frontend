"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatBytes, validateFile } from "@/lib/fileUtils";

/**
 * Dropzone — a generic drag-and-drop + click-to-browse target. Used directly
 * for simple "drop files here" needs, and internally by FileUpload,
 * ImageUpload, VideoUpload, etc. for their specialized variants.
 *
 * Features:
 * - Drag-over visual feedback (distinguishes "over the zone" from idle)
 * - Click anywhere to open the native file picker
 * - accept / maxSize / multiple validation with per-file error callback
 * - Custom render via `children` (render-prop gets { isDragging, browse })
 */
export default function Dropzone({
  id,
  onFilesAccepted, // (File[]) => void
  onFilesRejected, // ({ file, error }[]) => void
  accept,
  maxSize,
  multiple = true,
  disabled,
  className,
  children,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function processFiles(fileList) {
    const files = Array.from(fileList);
    const accepted = [];
    const rejected = [];
    for (const file of files) {
      const error = validateFile(file, { accept, maxSize });
      if (error) rejected.push({ file, error });
      else accepted.push(file);
    }
    if (!multiple && accepted.length > 1) {
      rejected.push(...accepted.slice(1).map((file) => ({ file, error: "Only one file is allowed" })));
      accepted.length = 1;
    }
    if (accepted.length) onFilesAccepted?.(accepted);
    if (rejected.length) onFilesRejected?.(rejected);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  }

  function browse() {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div
      id={fieldId}
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={browse}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && browse()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-colors duration-150 cursor-pointer outline-none",
        "focus-visible:ring-4 focus-visible:ring-brand-100",
        isDragging ? "border-brand-500 bg-brand-50" : "border-neutral-300 hover:border-neutral-400 bg-neutral-50/50",
        disabled && "opacity-60 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) processFiles(e.target.files);
          e.target.value = "";
        }}
        className="sr-only"
      />
      {children ? (
        typeof children === "function" ? children({ isDragging, browse }) : children
      ) : (
        <DefaultZoneContent isDragging={isDragging} accept={accept} maxSize={maxSize} />
      )}
    </div>
  );
}

function DefaultZoneContent({ isDragging, accept, maxSize }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
      <span className={cn("flex items-center justify-center size-11 rounded-full transition-colors", isDragging ? "bg-brand-100 text-brand-600" : "bg-neutral-100 text-neutral-400")}>
        <UploadIcon className="size-5" />
      </span>
      <p className="text-sm text-neutral-700">
        <span className="font-medium text-brand-600">Click to upload</span> or drag and drop
      </p>
      {(accept || maxSize) && (
        <p className="text-xs text-neutral-400">
          {accept ? accept.replaceAll(",", ", ") : "Any file type"}
          {maxSize && ` · up to ${formatBytes(maxSize)}`}
        </p>
      )}
    </div>
  );
}

function UploadIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 13V4M10 4 6.5 7.5M10 4l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 13v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
