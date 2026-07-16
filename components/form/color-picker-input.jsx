"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PALETTE = [
  "#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899",
  "#000000", "#4b5563", "#9ca3af", "#f3f4f6", "#ffffff"
];

function ColorPickerInputBase({
  label = "Pick Color",
  error,
  helperText,
  tooltip,
  disabled = false,
  value = "#000000",
  onChange,
  onBlur,
  id,
  is_required,
  colorsPalette = DEFAULT_PALETTE,
  className,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [colorValue, setColorValue] = useState(value);

  useEffect(() => {
    if (value) {
      setColorValue(value);
    }
  }, [value]);

  const handleColorChange = (newColor) => {
    if (disabled) return;

    // Hex validation
    if (/^#[0-9A-F]{6}$/i.test(newColor) || newColor === "") {
      setColorValue(newColor);
      if (onChange) {
        onChange(newColor);
      }
    }
  };

  const handleRawInputChange = (e) => {
    const val = e.target.value;
    setColorValue(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      if (onChange) onChange(val);
    }
  };

  const displayError = error;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className={cn("text-sm font-medium", displayError && "text-destructive", disabled && "opacity-50")}>
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>

          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {/* Picker Body */}
      <div className="flex items-center gap-2">
        {/* Color preview swatch + popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              style={{ backgroundColor: colorValue || "#ffffff" }}
              className={cn(
                "h-9 w-9 rounded-lg border border-input shadow-sm cursor-pointer shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                !colorValue && "bg-conic"
              )}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 flex flex-col gap-3" align="start">
            <span className="text-xs font-semibold text-muted-foreground">Select Color</span>

            {/* HTML5 color input */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorValue || "#000000"}
                onChange={(e) => handleColorChange(e.target.value)}
                disabled={disabled}
                className="h-10 w-10 cursor-pointer rounded border border-input p-0 shrink-0"
              />
              <span className="text-xs text-muted-foreground">Click to select custom color</span>
            </div>

            {/* Predefined Palette Swatches */}
            {colorsPalette.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground">Palette</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {colorsPalette.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleColorChange(c)}
                      style={{ backgroundColor: c }}
                      className={cn(
                        "h-7 w-7 rounded-md border border-input hover:scale-105 active:scale-95 transition-transform cursor-pointer",
                        colorValue === c && "ring-2 ring-primary/40 border-primary"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Text Input */}
        <Input
          id={inputId}
          type="text"
          value={colorValue}
          onChange={handleRawInputChange}
          disabled={disabled}
          placeholder="#000000"
          className={cn(
            "h-9 font-mono text-xs max-w-[120px]",
            displayError && "border-destructive focus-visible:ring-destructive/20"
          )}
          {...props}
        />
      </div>

      {/* Error & Helper */}
      {(helperText || displayError) && (
        <div className="text-xs px-0.5">
          {displayError ? (
            <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">
              {displayError}
            </span>
          ) : (
            <span className="text-muted-foreground">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ColorPickerInput({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <ColorPickerInputBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <ColorPickerInputBase {...props} />;
}
