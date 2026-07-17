"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { formatBytes, validateFile } from "@/lib/fileUtils";
import FieldWrapper from "./FieldWrapper";
import Dropzone from "./Dropzone";

/**
 * AudioUpload — single audio file uploader with a custom playback bar
 * (voice notes, podcast episodes, music tracks).
 *
 * Features:
 * - Custom play/pause button + scrubbable progress bar (styled HTML5 audio,
 *   not the bulky native browser control)
 * - Duration display, replace/remove actions
 */
export default function AudioUpload({
  id,
  label,
  description,
  error,
  disabled,
  maxSize,
  value,
  defaultValue = null,
  onChange,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [audio, setAudio] = useControllableState({ value, defaultValue, onChange });
  const [localError, setLocalError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  function handleFile(file) {
    const err = validateFile(file, { accept: "audio/*", maxSize });
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError("");
    setAudio({ url: URL.createObjectURL(file), file });
    setProgress(0);
    setPlaying(false);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  }

  function fmt(s) {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) audioRef.current.currentTime = ratio * duration;
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error || localError} disabled={disabled} className={className}>
      {!audio?.url ? (
        <Dropzone id={fieldId} accept="audio/*" maxSize={maxSize} multiple={false} disabled={disabled} onFilesAccepted={([f]) => handleFile(f)} onFilesRejected={(r) => setLocalError(r[0]?.error || "")}>
          <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
            <span className="flex items-center justify-center size-11 rounded-full bg-neutral-100 text-neutral-400">
              <AudioIcon className="size-5" />
            </span>
            <p className="text-sm text-neutral-700"><span className="font-medium text-brand-600">Upload audio</span> or drag and drop</p>
            <p className="text-xs text-neutral-400">MP3, WAV, M4A{maxSize && ` · up to ${formatBytes(maxSize)}`}</p>
          </div>
        </Dropzone>
      ) : (
        <div className="rounded-xl border border-neutral-200 p-3 flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="size-10 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 hover:bg-brand-600"
          >
            {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4 ml-0.5" />}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{audio.file?.name || "Audio file"}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] text-neutral-400 tabular-nums w-8">{fmt(progress)}</span>
              <div className="flex-1 h-1.5 rounded-full bg-neutral-100 cursor-pointer" onClick={handleSeek}>
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
              </div>
              <span className="text-[10px] text-neutral-400 tabular-nums w-8">{fmt(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-medium text-brand-600 hover:underline">Replace</button>
            <button type="button" onClick={() => setAudio(null)} className="text-xs font-medium text-danger-600 hover:underline">Remove</button>
          </div>

          <audio
            ref={audioRef}
            src={audio.url}
            onTimeUpdate={(e) => setProgress(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onEnded={() => setPlaying(false)}
            className="hidden"
          />
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
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

function AudioIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M7 14V6l8-2v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="14" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function PlayIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6 4.5v11l9-5.5-9-5.5Z" /></svg>;
}
function PauseIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6 4h3v12H6V4Zm5 0h3v12h-3V4Z" /></svg>;
}
