"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { validateFile } from "@/lib/fileUtils";
import FieldWrapper from "./FieldWrapper";
import { Spinner } from "./TextInput";

/**
 * AvatarUpload — circular profile-picture uploader with hover overlay.
 *
 * Features:
 * - Click or drag-drop to replace, hover shows a camera/edit overlay
 * - Initials fallback (pass `fallbackName`) when no image is set
 * - Size presets, remove button, optional upload-in-progress spinner state
 */
export default function AvatarUpload({
  id,
  label,
  description,
  error,
  disabled,
  value,
  defaultValue = null, // { url } or null
  onChange,
  onFileSelected, // (File) => void — hook your real upload here
  maxSize,
  fallbackName = "",
  size = "lg", // "sm" | "md" | "lg" | "xl"
  uploading = false,
  shape = "circle",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [avatar, setAvatar] = useControllableState({ value, defaultValue, onChange });
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const dims = { sm: "size-14", md: "size-20", lg: "size-28", xl: "size-36" }[size];
  const textSize = { sm: "text-sm", md: "text-lg", lg: "text-2xl", xl: "text-3xl" }[size];

  const shapeClass =
    shape === "square"
      ? "rounded-md"
      : shape === "circle"
        ? "rounded-full"
        : shape === "soft"
          ? "rounded-lg"
          : "rounded-xl";

  function handleFile(file) {
    const err = validateFile(file, { accept: "image/*", maxSize });
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError("");
    const url = URL.createObjectURL(file);
    setAvatar({ url });
    onFileSelected?.(file);
  }

  const initials = fallbackName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error || localError} disabled={disabled} className={className}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(dims, shapeClass, "relative  overflow-hidden shrink-0 group cursor-pointer bg-neutral-100 ring-2 ring-offset-2", isDragging ? "ring-brand-400" : "ring-transparent")}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          {avatar?.url ? (
            <img src={avatar.url} alt="Avatar" className={cn("w-full h-full", shape === "square" ? "object-contain" : "object-cover")} />
          ) : (
            <div className={cn("w-full h-full flex items-center justify-center font-semibold text-neutral-400", textSize)}>
              {initials || <CameraIcon className="size-1/3" />}
            </div>
          )}

          <div className={cn("absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center", !disabled && "group-hover:opacity-100")}>
            {uploading ? (
              <Spinner size="md" className="text-white" />
            ) : (
              <CameraIcon className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
              e.target.value = "";
            }}
            className="sr-only"
          />
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 text-left"
          >
            {avatar?.url ? "Change photo" : "Upload photo"}
          </button>
          {avatar?.url && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setAvatar(null)}
              className="text-sm text-neutral-400 hover:text-danger-600 text-left"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </FieldWrapper>
  );
}

function CameraIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M6.5 5.5 7.5 4h5l1 1.5H16A1.5 1.5 0 0 1 17.5 7v7A1.5 1.5 0 0 1 16 15.5H4A1.5 1.5 0 0 1 2.5 14V7A1.5 1.5 0 0 1 4 5.5h2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="10" cy="10.25" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
