"use client";

import { useId, useState } from "react";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { formatBytes, simulateUpload } from "@/lib/fileUtils";
import FieldWrapper from "./FieldWrapper";
import Dropzone from "./Dropzone";
import FileIcon from "./FileIcon";

/**
 * FileUpload — general-purpose multi-file uploader: drop zone up top, a
 * managed list of files below with per-file progress, retry, and remove.
 *
 * Each list entry shape: { id, file, status: "uploading"|"done"|"error", progress, url, error }
 *
 * Features:
 * - Per-file upload progress bar (wire `uploadFn` to your real upload; a
 *   simulated one is used by default so this works out of the box)
 * - Retry failed uploads, remove any file, reject invalid files with a toast-like inline message
 * - File count / total size summary, max file count enforcement
 */
export default function FileUpload({
  id,
  label,
  description,
  error,
  required,
  disabled,
  accept,
  maxSize,
  maxFiles,
  value,
  defaultValue = [],
  onChange,
  uploadFn = simulateUpload,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [files, setFiles] = useControllableState({ value, defaultValue, onChange });
  const [rejections, setRejections] = useState([]);

  function handleAccepted(newFiles) {
    setRejections([]);
    const room = maxFiles ? Math.max(0, maxFiles - files.length) : newFiles.length;
    const toAdd = newFiles.slice(0, room);
    if (newFiles.length > toAdd.length) {
      setRejections([{ error: `Only ${maxFiles} files allowed total` }]);
    }
    const entries = toAdd.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      status: "uploading",
      progress: 0,
    }));
    setFiles([...files, ...entries]);
    entries.forEach((entry) => runUpload(entry));
  }

  function runUpload(entry) {
    uploadFn(entry.file, (progress) => {
      setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, progress } : f)));
    })
      .then(({ url }) => {
        setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, status: "done", url, progress: 100 } : f)));
      })
      .catch(() => {
        setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, status: "error", error: "Upload failed" } : f)));
      });
  }

  function handleRejected(rejected) {
    setRejections(rejected);
  }

  function removeFile(fileId) {
    setFiles(files.filter((f) => f.id !== fileId));
  }

  function retryFile(fileId) {
    const entry = files.find((f) => f.id === fileId);
    if (!entry) return;
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f)));
    runUpload(entry);
  }

  const totalSize = files.reduce((sum, f) => sum + (f.file?.size || 0), 0);

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} size={size} className={className}>
      <Dropzone
        id={fieldId}
        accept={accept}
        maxSize={maxSize}
        multiple
        disabled={disabled || (maxFiles && files.length >= maxFiles)}
        onFilesAccepted={handleAccepted}
        onFilesRejected={handleRejected}
      />

      {rejections.length > 0 && (
        <div className="flex flex-col gap-1">
          {rejections.map((r, i) => (
            <p key={i} className="text-xs text-danger-600">{r.error}</p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>{files.length} file{files.length !== 1 ? "s" : ""}{maxFiles ? ` / ${maxFiles}` : ""}</span>
            <span>{formatBytes(totalSize)} total</span>
          </div>
          <ul className="flex flex-col gap-2">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-2.5">
                <FileIcon filename={f.file.name} className="size-9" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-neutral-800 truncate">{f.file.name}</p>
                    <span className="text-xs text-neutral-400 shrink-0">{formatBytes(f.file.size)}</span>
                  </div>
                  {f.status === "uploading" && (
                    <div className="h-1 w-full rounded-full bg-neutral-100 overflow-hidden mt-1.5">
                      <div className="h-full bg-brand-500 rounded-full transition-all duration-200" style={{ width: `${f.progress}%` }} />
                    </div>
                  )}
                  {f.status === "error" && <p className="text-xs text-danger-600 mt-1">{f.error}</p>}
                  {f.status === "done" && <p className="text-xs text-success-600 mt-1">Uploaded</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {f.status === "error" && (
                    <button type="button" onClick={() => retryFile(f.id)} className="text-neutral-400 hover:text-brand-600 p-1 rounded-md hover:bg-neutral-100" aria-label="Retry">
                      <RetryIcon className="size-4" />
                    </button>
                  )}
                  <button type="button" onClick={() => removeFile(f.id)} className="text-neutral-400 hover:text-danger-600 p-1 rounded-md hover:bg-neutral-100" aria-label="Remove">
                    <XIcon className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </FieldWrapper>
  );
}

function XIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>;
}
function RetryIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M15.312 5.312a5.5 5.5 0 1 0 1.472 5.026.75.75 0 1 1 1.478.257 7 7 0 1 1-1.878-6.394l.878.878V3a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75H14.5a.75.75 0 0 1 0-1.5h1.813l-1.001-1.438Z" clipRule="evenodd" /></svg>;
}
