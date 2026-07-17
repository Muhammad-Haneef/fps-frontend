"use client";

import React, { useState, useRef, useCallback, useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Edit2, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function ImageUploadBase({
  label,
  error,
  helperText,
  tooltip,
  disabled = false,
  value,
  onChange,
  onBlur,
  id: externalId,
  is_required,
  className,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  aspectRatio = "square",
  showPreview = true,
  allowZoom = true,
  ...props
}) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "",
  };

  const processFile = useCallback(
    (file) => {
      setImageError(null);

      if (!file.type.startsWith("image/")) {
        setImageError("Please select an image file");
        return;
      }

      if (maxSize && file.size > maxSize) {
        setImageError(
          `Image size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onChange?.(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [maxSize, onChange]
  );

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
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
      const files = e.dataTransfer?.files;
      if (files) handleFiles(files);
    },
    [handleFiles]
  );

  const displayError = error || imageError;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {label && (
        <Label
          className={cn(
            "text-sm font-medium",
            displayError && "text-destructive",
            disabled && "opacity-50"
          )}
        >
          {label}
          {is_required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {value ? (
        <div className="space-y-2">
          <div
            className={cn(
              "relative rounded-lg overflow-hidden border-2 border-border group max-w-[200px]",
              aspectRatioClasses[aspectRatio] || "aspect-square"
            )}
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              {allowZoom && (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(true);
                  }}
                  className="h-7 w-7"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
              )}
              {/* <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={disabled}
                className="h-7 w-7"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button> */}
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={disabled}
                className="h-7 w-7 bg-white"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all py-6 px-4",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            displayError && "border-destructive",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            {...props}
          />
          <Upload
            className={cn(
              "w-6 h-6 mb-1.5 pointer-events-none",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-xs font-medium text-foreground mb-0.5 pointer-events-none">
            {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
          </p>
          <p className="text-[10px] text-muted-foreground pointer-events-none">
            {accept} • Max {(maxSize / (1024 * 1024)).toFixed(1)}MB
          </p>
        </div>
      )}

      {(helperText || displayError) && (
        <p
          className={cn(
            "text-xs",
            displayError ? "text-destructive font-medium" : "text-muted-foreground"
          )}
        >
          {displayError || helperText}
        </p>
      )}

      {allowZoom && value && (
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogContent className="max-w-4xl">
            <img src={value} alt="Zoomed preview" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function ImageUpload({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <ImageUploadBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <ImageUploadBase {...props} />;
}
