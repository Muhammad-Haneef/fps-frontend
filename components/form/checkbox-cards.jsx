"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function CheckboxCardsBase({
  title,
  error,
  helperText,
  disabled = false,
  value = [],
  onChange,
  is_required,
  className,
  options = [],
  columns = 2,
  showIcon = true,
  showDescription = true,
  max,
  ...props
}) {
  const selectedValues = Array.isArray(value) ? value : [];

  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const handleToggle = (optionId) => {
    if (disabled) return;

    const isSelected = selectedValues.includes(optionId);

    let newValue;
    if (isSelected) {
      newValue = selectedValues.filter((v) => v !== optionId);
    } else {
      if (max && selectedValues.length >= max) return;
      newValue = [...selectedValues, optionId];
    }

    onChange?.(newValue);
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {title && (
        <div className="flex items-center justify-between">
          <Label
            className={cn(
              "text-sm font-medium",
              error && "text-destructive",
              disabled && "opacity-50"
            )}
          >
            {title}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {max && (
            <span className="text-xs text-muted-foreground">
              {selectedValues.length} / {max} selected
            </span>
          )}
        </div>
      )}

      <div className={cn("grid gap-3", gridClasses[columns])}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.id);
          const isDisabled =
            disabled ||
            option.disabled ||
            (max && !isSelected && selectedValues.length >= max);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleToggle(option.id)}
              disabled={isDisabled}
              className={cn(
                "relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all",
                "hover:border-primary/50 hover:bg-accent/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {showIcon && option.icon && (
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {option.icon}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm mb-1">{option.title}</div>
                {showDescription && option.description && (
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-border bg-background"
                )}
              >
                {isSelected && (
                  <Check className="w-3 h-3 text-primary-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {(helperText || error) && (
        <p
          className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default function CheckboxCards({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <CheckboxCardsBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <CheckboxCardsBase {...props} />;
}
