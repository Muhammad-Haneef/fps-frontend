"use client";

import { cn } from "@/lib/utils";
import { getFileKind } from "@/lib/fileUtils";

const COLORS = {
  pdf: "text-danger-500 bg-danger-50",
  doc: "text-brand-500 bg-brand-50",
  sheet: "text-success-500 bg-success-50",
  slide: "text-warning-500 bg-warning-50",
  archive: "text-neutral-500 bg-neutral-100",
  audio: "text-brand-500 bg-brand-50",
  video: "text-danger-500 bg-danger-50",
  image: "text-success-500 bg-success-50",
  file: "text-neutral-500 bg-neutral-100",
};

export default function FileIcon({ filename, className }) {
  const kind = getFileKind(filename);
  return (
    <span className={cn("flex items-center justify-center rounded-lg shrink-0", COLORS[kind], className)}>
      <svg viewBox="0 0 24 24" fill="none" className="size-1/2">
        <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
