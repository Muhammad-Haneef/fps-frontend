"use client";

import React, { useState, useRef, useCallback, useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Edit2, User } from "lucide-react";
import { cn } from "@/lib/utils";

function AvatarUploadBase({
  label,
  error,
  helperText,
  tooltip,
  disabled = false,
  icon: Icon = User,
  value,
  onChange,
  onBlur,
  id: externalId,
  is_required,
  className,
  accept = "image/*",
  maxSize = 2 * 1024 * 1024, // 2MB
  size = "lg",
  shape = "circle",
  showEditButton = true,
  ...props
}) {
  const generatedId = useId();
  const inputId = externalId || generatedId;

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-lg",
  };

  // Process selected file
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
        onChange?.(reader.result); // base64 data URL
      };
      reader.readAsDataURL(file);
    },
    [maxSize, onChange]
  );

  // Unified handler for file selection
  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    onChange?.(null);
    // Reset the input so the same file can be re-uploaded if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  // Drag events for the label
  const handleDrag = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragging(true);
      } else if (e.type === "dragleave") {
        setIsDragging(false);
      }
    },
    []
  );

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
    <div className={cn("flex flex-col gap-2 items-center", className)}>
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

      <div className="relative group">
        {value ? (
          /* ---------- AVATAR PREVIEW ---------- */
          <div
            className={cn(
              "relative overflow-hidden border-2 border-border",
              sizeClasses[size],
              shapeClasses[shape]
            )}
          >
            <img
              src={value}
              alt="Avatar"
              className={`w-full h-full ${shape === "square" ? "object-contain" : "object-cover"}`}
            />
            {!disabled && showEditButton && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Edit button – opens the same file dialog */}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Directly trigger the hidden input via ref
                    fileInputRef.current?.click();
                  }}
                  aria-label="Change avatar"
                  className="h-8 w-8"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                {/* Remove button */}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  aria-label="Remove avatar"
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* ---------- EMPTY DROP ZONE (label triggers hidden input) ---------- */
          <label
            htmlFor={inputId}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer",
              sizeClasses[size],
              shapeClasses[shape],
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/30",
              displayError && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
            // Keyboard accessibility – the label itself is focusable because of htmlFor
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                // Label’s default action will open file dialog
                fileInputRef.current?.click();
              }
            }}
          >
            {isDragging ? (
              <Upload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <Icon className="w-10 h-10 text-muted-foreground" />
            )}
          </label>
        )}
      </div>

      {/* Hidden file input – connected to the label via id */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        className="absolute w-0 h-0 opacity-0 overflow-hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          // Clear the input value so the same file can be selected again after removal
          e.target.value = "";
        }}
        aria-hidden="true"
        {...props}
      />

      {/* Explicit upload button (shown only when empty) */}
      {/* {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="text-xs"
        >
          <Upload className="w-3 h-3 mr-1" />
          Upload Photo
        </Button>
      )} */}

      {/* Helper / Error text */}
      {(helperText || displayError) && (
        <p
          className={cn(
            "text-xs text-center w-full",
            displayError ? "text-destructive" : "text-muted-foreground"
          )}
          role={displayError ? "alert" : undefined}
        >
          {displayError || helperText}
        </p>
      )}
    </div>
  );
}

export default function AvatarUpload({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <AvatarUploadBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <AvatarUploadBase {...props} />;
}