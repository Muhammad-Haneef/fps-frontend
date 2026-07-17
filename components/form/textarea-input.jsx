"use client";

import * as React from "react";
import { useState, useId, useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function TextareaInputBase({
  label,
  error,
  helperText,
  tooltip,
  disabled,
  placeholder = "",
  maxLength,
  rows = 3,
  id,
  is_required,
  value,
  onChange,
  onBlur,
  dir = "ltr",
  autoResize = true,
  className,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const textareaRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
    if (autoResize) resizeTextarea();
  }, [value]);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleChange = (e) => {
    const newVal = e.target.value;
    setInternalValue(newVal);
    if (autoResize) resizeTextarea();
    if (onChange) onChange(e);
  };

  const displayError = error;
  const isRTL = dir === "rtl";

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label
            htmlFor={inputId}
            className={cn(
              "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
              displayError && "text-destructive",
              disabled && "opacity-50"
            )}
          >
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/75 cursor-pointer hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent><p className="max-w-xs text-xs">{tooltip}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      <Textarea
        id={inputId}
        ref={(el) => { textareaRef.current = el; }}
        rows={rows}
        value={internalValue}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          "w-full rounded-lg border border-input bg-background text-sm transition-shadow",
          autoResize && "resize-none overflow-hidden",
          displayError && "border-destructive focus-visible:ring-destructive/20",
          isRTL && "text-right"
        )}
        {...props}
      />

      {(helperText || displayError || maxLength) && (
        <div className="flex justify-between items-start text-[11px] px-0.5 gap-4">
          {displayError ? (
            <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">{displayError}</span>
          ) : helperText ? (
            <span className="text-muted-foreground">{helperText}</span>
          ) : <span />}
          {maxLength && <span className="text-muted-foreground whitespace-nowrap">{String(internalValue).length}/{maxLength}</span>}
        </div>
      )}
    </div>
  );
}

export default function TextareaInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <TextareaInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <TextareaInputBase {...props} />;
}
