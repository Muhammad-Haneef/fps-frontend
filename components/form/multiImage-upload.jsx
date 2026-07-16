// "use client";

import React, { useState, useRef, useCallback, useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, ZoomIn, MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function MultiImageUploadBase({
  label,
  error,
  helperText,
  tooltip,
  disabled = false,
  value = [],
  onChange,
  onBlur,
  id: externalId,
  is_required,
  className,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB per image
  maxImages = 10,
  showCount = true,
  allowReorder = true,
  gridCols = 3,
  ...props
}) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  // Process multiple files
  const handleFiles = useCallback(
    (files) => {
      setImageError(null);

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        setImageError("Please select image files");
        return;
      }

      if (images.length + imageFiles.length > maxImages) {
        setImageError(`Maximum ${maxImages} images allowed`);
        return;
      }

      const oversized = imageFiles.filter((f) => f.size > maxSize);
      if (oversized.length > 0) {
        setImageError(
          `Some images exceed ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`
        );
        return;
      }

      const readers = imageFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(readers).then((results) => {
        onChange?.([...images, ...results]);
      });
    },
    [images, maxImages, maxSize, onChange]
  );

  const handleRemove = useCallback(
    (index) => {
      const updated = images.filter((_, i) => i !== index);
      onChange?.(updated);
    },
    [images, onChange]
  );

  // Drag & drop (upload)
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
      const files = Array.from(e.dataTransfer?.files || []);
      handleFiles(files);
    },
    [handleFiles]
  );

  // Reordering
  const handleDragStart = useCallback((index) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOverReorder = useCallback(
    (e, index) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);

      setDraggedIndex(index);
      onChange?.(newImages);
    },
    [draggedIndex, images, onChange]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const displayError = error || imageError;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
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
          {showCount && images.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {images.length} / {maxImages} images
            </span>
          )}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-3 mb-2",
            // Tailwind JIT may not recognise dynamic grid-cols-*, consider using a style prop for production
            `grid-cols-${gridCols}`
          )}
        >
          {images.map((img, index) => (
            <div
              key={index}
              draggable={allowReorder && !disabled}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverReorder(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 border-border group",
                allowReorder && "cursor-move",
                draggedIndex === index && "opacity-50"
              )}
            >
              <img
                src={img}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {allowReorder && (
                  <div className="absolute top-1 left-1 bg-white/90 rounded p-1">
                    <MoveHorizontal className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedImage(img);
                  }}
                  className="h-7 w-7"
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  disabled={disabled}
                  className="h-7 w-7"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area – now a label for the file input */}
      {images.length < maxImages && (
        <label
          htmlFor={inputId}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          // Keyboard access
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer py-8",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            displayError && "border-destructive",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <Upload
            className={cn(
              "w-8 h-8 mb-2",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-sm font-medium text-foreground mb-1">
            {isDragging ? "Drop images here" : "Click to upload or drag & drop"}
          </p>
          <p className="text-xs text-muted-foreground">
            {accept} • Max {(maxSize / (1024 * 1024)).toFixed(1)}MB each • {maxImages - images.length} remaining
          </p>
        </label>
      )}

      {/* Hidden file input – NOT display:none, so it can be triggered programmatically */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple
        disabled={disabled}
        className="absolute w-0 h-0 opacity-0 overflow-hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          handleFiles(files);
          e.target.value = ""; // allow re-upload of same files
        }}
        aria-hidden="true"
        {...props}
      />

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

      {/* Zoom Modal */}
      {zoomedImage && (
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-4xl">
            <img src={zoomedImage} alt="Zoomed preview" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function MultiImageUpload({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <MultiImageUploadBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <MultiImageUploadBase {...props} />;
}