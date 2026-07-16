"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function SegmentedControlBase({
  label,
  error,
  helperText,
  tooltip,
  disabled = false,
  value,
  onChange,
  onBlur,
  id,
  is_required,
  className,
  options = [],
  size = "default", // "sm", "default", "lg"
  fullWidth = false,
  ...props
}) {
  const sizeClasses = {
    sm: "h-8 text-xs px-3",
    default: "h-10 text-sm px-4",
    lg: "h-12 text-base px-6"
  };

  const handleSelect = (optionValue) => {
    if (!disabled) {
      onChange?.(optionValue);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {label && (
        <Label className={cn("text-sm font-medium", error && "text-destructive", disabled && "opacity-50")}>
          {label}
          {is_required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div
        className={cn(
          "inline-flex items-center rounded-lg bg-muted p-1",
          fullWidth && "w-full"
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={disabled || option.disabled}
              className={cn(
                "relative inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                sizeClasses[size],
                fullWidth && "flex-1",
                isSelected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              {option.icon && (
                <span className="mr-2">{option.icon}</span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>

      {(helperText || error) && (
        <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default function SegmentedControl({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <SegmentedControlBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <SegmentedControlBase {...props} />;
}
