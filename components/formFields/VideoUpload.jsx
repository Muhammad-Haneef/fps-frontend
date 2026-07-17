"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { formatBytes, validateFile } from "@/lib/fileUtils";
import FieldWrapper from "./FieldWrapper";
import Dropzone from "./Dropzone";

/**
 * VideoUpload — single video file uploader with an inline HTML5 player
 * preview once a file is selected (product demo videos, testimonials).
 *
 * Features:
 * - Duration + file size shown once metadata loads
 * - Replace/remove actions overlaid on the preview
 * - Accepts video/* by default, configurable max size
 */
export default function VideoUpload({
  id,
  label,
  description,
  error,
  disabled,
  maxSize,
  value,
  defaultValue = null, // { url, file }
  onChange,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [video, setVideo] = useControllableState({ value, defaultValue, onChange });
  const [localError, setLocalError] = useState("");
  const [duration, setDuration] = useState(null);
  const inputRef = useRef(null);

  function handleFile(file) {
    const err = validateFile(file, { accept: "video/*", maxSize });
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError("");
    setDuration(null);
    setVideo({ url: URL.createObjectURL(file), file });
  }

  function formatDuration(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error || localError} disabled={disabled} className={className}>
      {!video?.url ? (
        <Dropzone id={fieldId} accept="video/*" maxSize={maxSize} multiple={false} disabled={disabled} onFilesAccepted={([f]) => handleFile(f)} onFilesRejected={(r) => setLocalError(r[0]?.error || "")}>
          <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
            <span className="flex items-center justify-center size-11 rounded-full bg-neutral-100 text-neutral-400">
              <VideoIcon className="size-5" />
            </span>
            <p className="text-sm text-neutral-700"><span className="font-medium text-brand-600">Upload a video</span> or drag and drop</p>
            <p className="text-xs text-neutral-400">MP4, WEBM, MOV{maxSize && ` · up to ${formatBytes(maxSize)}`}</p>
          </div>
        </Dropzone>
      ) : (
        <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900">
          <video
            src={video.url}
            controls
            className="w-full max-h-80 bg-black"
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
          />
          <div className="flex items-center justify-between px-3 py-2 bg-neutral-0">
            <div className="text-xs text-neutral-500">
              {video.file && formatBytes(video.file.size)}
              {duration !== null && ` · ${formatDuration(duration)}`}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-medium text-brand-600 hover:underline">Replace</button>
              <button type="button" onClick={() => setVideo(null)} className="text-xs font-medium text-danger-600 hover:underline">Remove</button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </FieldWrapper>
  );
}

function VideoIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2.5" y="4.5" width="10" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 8.2v3.6l2.5 1.7V6.5L15 8.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
