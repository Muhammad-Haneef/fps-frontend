"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import { formatBytes } from "@/lib/fileUtils";
import FieldWrapper from "./FieldWrapper";
import Dropzone from "./Dropzone";
import FileIcon from "./FileIcon";

const DEFAULT_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";

/**
 * DocumentUpload — uploader tuned for office/paperwork documents
 * (contracts, resumes, invoices) — compact list rows with type icons
 * rather than an image-style thumbnail grid.
 *
 * Features:
 * - Restricts to document types by default (`accept` overridable)
 * - Compact single-line rows: icon, name, size, remove
 */
export default function DocumentUpload({
  id,
  label,
  description,
  error,
  required,
  disabled,
  accept = DEFAULT_ACCEPT,
  maxSize,
  maxFiles,
  value,
  defaultValue = [],
  onChange,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [docs, setDocs] = useControllableState({ value, defaultValue, onChange });
  const [rejectMsg, setRejectMsg] = useState("");

  function handleAccepted(files) {
    setRejectMsg("");
    const room = maxFiles ? Math.max(0, maxFiles - docs.length) : files.length;
    const toAdd = files.slice(0, room);
    if (files.length > toAdd.length) setRejectMsg(`Only ${maxFiles} documents allowed`);
    const entries = toAdd.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
    }));
    setDocs([...docs, ...entries]);
  }

  function remove(docId) {
    setDocs(docs.filter((d) => d.id !== docId));
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <Dropzone
        id={fieldId}
        accept={accept}
        maxSize={maxSize}
        multiple
        disabled={disabled || (maxFiles && docs.length >= maxFiles)}
        onFilesAccepted={handleAccepted}
        onFilesRejected={(r) => setRejectMsg(r[0]?.error || "")}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
          <span className="flex items-center justify-center size-11 rounded-full bg-neutral-100 text-neutral-400">
            <DocIcon className="size-5" />
          </span>
          <p className="text-sm text-neutral-700"><span className="font-medium text-brand-600">Upload documents</span> or drag and drop</p>
          <p className="text-xs text-neutral-400">PDF, DOC, XLS, PPT{maxSize && ` · up to ${formatBytes(maxSize)}`}</p>
        </div>
      </Dropzone>

      {rejectMsg && <p className="text-xs text-danger-600">{rejectMsg}</p>}

      {docs.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center gap-2.5 rounded-lg border border-neutral-200 px-2.5 py-2">
              <FileIcon filename={d.file.name} className="size-8" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-800 truncate">{d.file.name}</p>
                <p className="text-xs text-neutral-400">{formatBytes(d.file.size)}</p>
              </div>
              <button type="button" onClick={() => remove(d.id)} className="text-neutral-400 hover:text-danger-600 p-1 rounded-md hover:bg-neutral-100 shrink-0" aria-label="Remove">
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </FieldWrapper>
  );
}

function DocIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5.5 2.5h6l3 3v11a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11.5 2.5v3h3M7 10.5h6M7 13.5h6M7 7.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function XIcon({ className }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>;
}
