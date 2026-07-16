"use client";

import * as React from "react";
import { useId, useState, useEffect, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HelpCircle,
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  FileVideo,
} from "lucide-react";
import { cn } from "@/lib/utils";

const getFileIcon = (file) => {
  const type = file?.type || "";
  if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
  if (type.startsWith("video/")) return <FileVideo className="h-4 w-4" />;
  if (type.includes("pdf")) return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const formatSize = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function FileUploadBase({
  label,
  error,
  helperText,
  tooltip,
  disabled,
  id,
  is_required,
  value = [],
  onChange,
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  dir = "ltr",
  className,
  ...props
}) {
  const inputId = id || useId();
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const files = Array.isArray(value) ? value : value ? [value] : [];

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((file) =>
      file?.type?.startsWith("image/") ? URL.createObjectURL(file) : null
    );
    setPreviews(urls);
    return () => {
      urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const handleFiles = useCallback(
    (fileList) => {
      if (disabled) return;
      setFileError("");

      const newFiles = Array.from(fileList);

      if (maxSize) {
        const invalid = newFiles.find((f) => f.size > maxSize);
        if (invalid) {
          setFileError(`Maximum size is ${formatSize(maxSize)}.`);
          return;
        }
      }

      if (maxFiles && files.length + newFiles.length > maxFiles) {
        setFileError(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      const updated = multiple ? [...files, ...newFiles] : [newFiles[0]];
      onChange?.(updated);
    },
    [disabled, maxSize, maxFiles, files, multiple, onChange]
  );

  const removeFile = useCallback(
    (index) => {
      const updated = files.filter((_, i) => i !== index);
      onChange?.(updated);
    },
    [files, onChange]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const displayError = error || fileError;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-2">
          <Label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide"
          >
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 cursor-pointer text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {/* Hidden file input – NOT display:none, so label triggers work reliably */}
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="absolute w-0 h-0 opacity-0 overflow-hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(e.target.files);
          }
          e.target.value = ""; // allow re-upload of the same file
        }}
        aria-hidden="true"
        {...props}
      />

      <label
        htmlFor={inputId}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        // Keyboard support
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // The label's htmlFor will trigger the input
            document.getElementById(inputId)?.click();
          }
        }}
        className={cn(
          "flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition",
          isDragging && "border-primary bg-muted",
          displayError && "border-destructive",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="mb-2 h-6 w-6" />
        <p className="font-medium">
          {isDragging ? "Drop files here" : "Click to upload or drag & drop"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {accept || "Any file"}
          {maxSize && ` • Max ${formatSize(maxSize)}`}
          {maxFiles && ` • ${maxFiles} files`}
        </p>
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-md border p-2"
            >
              {previews[index] ? (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="h-14 w-14 rounded object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded bg-muted">
                  {getFileIcon(file)}
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(file.size)}
                </p>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {(helperText || displayError) && (
        <p
          className={cn(
            "text-xs",
            displayError ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {displayError || helperText}
        </p>
      )}
    </div>
  );
}

export default function FileUpload({ name, ...props }) {
  const form = useFormContext();

  if (form && name) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <FileUploadBase
            {...props}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  }

  return <FileUploadBase {...props} />;
}