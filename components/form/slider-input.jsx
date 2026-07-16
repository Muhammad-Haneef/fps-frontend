"use client";

import * as React from "react";
import { useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function SliderInputBase({
  label, error, helperText, tooltip, disabled, min = 0, max = 100, step = 1,
  id, is_required, value, onChange, onBlur, showValues = true, suffix = "",
  prefix = "", rangeMode = false, className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const safeValue = rangeMode
    ? Array.isArray(value) ? value : [min, max]
    : typeof value === "number" ? [value] : [min];

  const handleChange = (val) => {
    if (disabled) return;
    if (onChange) onChange(rangeMode ? val : val[0]);
  };

  const formatVal = (v) => `${prefix}${v}${suffix}`;
  const displayValue = rangeMode ? `${formatVal(safeValue[0])} – ${formatVal(safeValue[1])}` : formatVal(safeValue[0]);

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Label htmlFor={inputId} className={cn("text-xs font-semibold tracking-wider text-muted-foreground", error && "text-destructive", disabled && "opacity-50")}>
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
          {showValues && (
            <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded-md">{displayValue}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 px-0.5">
        <span className="text-xs text-muted-foreground w-8 text-left shrink-0">{formatVal(min)}</span>
        <Slider
          id={inputId}
          value={safeValue}
          min={min} max={max} step={step}
          onValueChange={handleChange}
          disabled={disabled}
          className={cn("flex-1", error && "[&>span:first-child]:bg-destructive/30 [&>span>span]:bg-destructive")}
          {...props}
        />
        <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{formatVal(max)}</span>
      </div>

      {(helperText || error) && (
        <div className="text-[11px] px-0.5">
          {error ? <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">{error}</span>
            : <span className="text-muted-foreground">{helperText}</span>}
        </div>
      )}
    </div>
  );
}

export default function SliderInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <SliderInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <SliderInputBase {...props} />;
}
