"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { formatBytes } from "@/lib/fileUtils";
import FieldWrapper from "./FieldWrapper";
import Dropzone from "./Dropzone";

/**
 * ImageUpload — image-specific uploader with a live thumbnail grid
 * (product photos, gallery uploads).
 *
 * Each entry: { id, file, url } — `url` is an object URL generated locally
 * for instant preview (revoke happens automatically on removal/unmount).
 *
 * Features:
 * - Thumbnail grid with hover-to-remove and drag-to-reorder (via native HTML5 DnD)
 * - "Set as cover" — first image is visually marked as the primary/cover image
 * - Per-image file size shown on hover, accepts only image/* by default
 */
export default function ImageUpload({
  id,
  label,
  description,
  error,
  required,
  disabled,
  maxSize,
  maxFiles,
  value,
  defaultValue = [],
  onChange,
  columns = 4,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [images, setImages] = useControllableState({ value, defaultValue, onChange });
  const [dragIndex, setDragIndex] = useState(null);
  const [rejectMsg, setRejectMsg] = useState("");

  useEffect(() => {
    return () => images.forEach((img) => img.url?.startsWith("blob:") && URL.revokeObjectURL(img.url));
    // eslint-disable-next-line
  }, []);

  function handleAccepted(files) {
    setRejectMsg("");
    const room = maxFiles ? Math.max(0, maxFiles - images.length) : files.length;
    const toAdd = files.slice(0, room);
    if (files.length > toAdd.length) setRejectMsg(`Only ${maxFiles} images allowed total`);
    const entries = toAdd.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setImages([...images, ...entries]);
  }

  function removeImage(imgId) {
    const img = images.find((i) => i.id === imgId);
    if (img?.url?.startsWith("blob:")) URL.revokeObjectURL(img.url);
    setImages(images.filter((i) => i.id !== imgId));
  }

  function reorder(from, to) {
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setImages(next);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <Dropzone
        id={fieldId}
        accept="image/*"
        maxSize={maxSize}
        multiple
        disabled={disabled || (maxFiles && images.length >= maxFiles)}
        onFilesAccepted={handleAccepted}
        onFilesRejected={(r) => setRejectMsg(r[0]?.error || "")}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
          <span className="flex items-center justify-center size-11 rounded-full bg-neutral-100 text-neutral-400">
            <ImageIcon className="size-5" />
          </span>
          <p className="text-sm text-neutral-700"><span className="font-medium text-brand-600">Upload images</span> or drag and drop</p>
          <p className="text-xs text-neutral-400">PNG, JPG, WEBP{maxSize && ` · up to ${formatBytes(maxSize)}`}</p>
        </div>
      </Dropzone>

      {rejectMsg && <p className="text-xs text-danger-600">{rejectMsg}</p>}

      {images.length > 0 && (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {images.map((img, i) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) reorder(dragIndex, i);
                setDragIndex(null);
              }}
              className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-200 cursor-move"
            >
              <img src={img.url} alt={img.file?.name || "Uploaded image"} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 rounded-full bg-brand-500 text-white text-[10px] font-medium px-2 py-0.5">Cover</span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="size-7 rounded-full bg-white/90 text-neutral-700 hover:bg-white flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}

function ImageIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17.5 13 13 9l-8 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>;
}
