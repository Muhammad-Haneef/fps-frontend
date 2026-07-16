"use client";

import * as React from "react";
import { useState, useId, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

function TagInputBase({
  label, error, helperText, tooltip, disabled = false, placeholder = "Type and press Enter to add tag...",
  id, is_required, value = [], onChange, onBlur, maxTags, allowDuplicates = false,
  delimiter = "Enter", dir = "ltr", className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const tags = Array.isArray(value) ? value : [];

  const addTag = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (disabled) return;
    if (!allowDuplicates && tags.includes(trimmed)) return;
    if (maxTags && tags.length >= maxTags) return;
    const newTags = [...tags, trimmed];
    if (onChange) onChange(newTags);
    setInputValue("");
  };

  const removeTag = (index) => {
    if (disabled) return;
    const newTags = tags.filter((_, i) => i !== index);
    if (onChange) onChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === delimiter || (delimiter === "Enter" && e.key === "Enter")) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (delimiter === "," && e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleBlur = (e) => {
    if (inputValue) addTag(inputValue);
    if (onBlur) onBlur(e);
  };

  const displayError = error;
  const isAtMax = maxTags && tags.length >= maxTags;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label htmlFor={inputId} className={cn("text-xs font-semibold tracking-wider text-muted-foreground", displayError && "text-destructive", disabled && "opacity-50")}>
            {label}{is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground/75 cursor-pointer hover:text-foreground" /></TooltipTrigger>
                <TooltipContent><p className="max-w-xs text-xs">{tooltip}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      <div
        onClick={() => !disabled && !isAtMax && inputRef.current?.focus()}
        className={cn(
          "min-h-[38px] w-full flex flex-wrap gap-1.5 items-center border border-input rounded-lg bg-background px-3 py-2 cursor-text transition-all",
          "focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-ring",
          displayError && "border-destructive focus-within:ring-destructive/20",
          (disabled || isAtMax) && "opacity-50 cursor-not-allowed",
        )}
      >
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs pl-2 pr-1 py-0.5 rounded-md font-medium">
            <span className="truncate max-w-[120px]">{tag}</span>
            {!disabled && (
              <span onClick={(e) => { e.stopPropagation(); removeTag(index); }}
                className="rounded p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                <X className="h-3 w-3" />
              </span>
            )}
          </Badge>
        ))}
        {!isAtMax && (
          <input
            ref={inputRef}
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={disabled || isAtMax}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none border-0 text-sm placeholder:text-muted-foreground py-0.5"
            {...props}
          />
        )}
      </div>

      {(helperText || displayError || maxTags) && (
        <div className="flex justify-between items-start text-[11px] px-0.5 gap-4">
          {displayError ? <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">{displayError}</span>
            : helperText ? <span className="text-muted-foreground">{helperText}</span> : <span />}
          {maxTags && <span className="text-muted-foreground whitespace-nowrap">{tags.length}/{maxTags}</span>}
        </div>
      )}
    </div>
  );
}

export default function TagInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <TagInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <TagInputBase {...props} />;
}
