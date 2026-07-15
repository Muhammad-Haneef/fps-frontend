"use client";

import * as React from "react";
import { useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function RadioInputBase({
  label, error, helperText, tooltip, disabled, options = [], value, onChange, onBlur,
  id, is_required, orientation = "vertical", layout = "default", dir = "ltr", className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleValueChange = (val) => {
    if (disabled) return;
    if (onChange) onChange(val);
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground", error && "text-destructive", disabled && "opacity-50")}>
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

      <RadioGroup
        value={value} onValueChange={handleValueChange} disabled={disabled}
        className={cn(
          "grid gap-2",
          orientation === "horizontal" ? "grid-flow-col auto-cols-max gap-4" : "grid-flow-row",
          layout === "card" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
        {...props}
      >
        {options.map((option, index) => {
          const optionId = `${inputId}-option-${index}`;
          const isSelected = String(value) === String(option.value);

          if (layout === "card") {
            return (
              <div key={option.value}
                onClick={() => !disabled && !option.disabled && handleValueChange(option.value)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border border-input bg-background hover:bg-accent/40 cursor-pointer transition-all select-none",
                  isSelected && "border-primary ring-2 ring-primary/20",
                  (disabled || option.disabled) && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <RadioGroupItem value={String(option.value)} id={optionId} className="mt-0.5" disabled={disabled || option.disabled} />
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={optionId} className={cn("font-semibold text-sm cursor-pointer", isSelected ? "text-primary" : "text-foreground")}>
                    {option.icon && <span className="inline-block mr-1.5">{option.icon}</span>}{option.label}
                  </Label>
                  {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
                </div>
              </div>
            );
          }

          return (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={String(option.value)} id={optionId} disabled={disabled || option.disabled} />
              <Label htmlFor={optionId} className={cn("text-sm cursor-pointer select-none", (disabled || option.disabled) && "opacity-50 cursor-not-allowed")}>
                {option.icon && <span className="inline-block mr-1.5">{option.icon}</span>}{option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {(helperText || error) && (
        <div className="text-[11px] px-0.5">
          {error ? <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">{error}</span>
            : <span className="text-muted-foreground">{helperText}</span>}
        </div>
      )}
    </div>
  );
}

export default function RadioInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <RadioInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <RadioInputBase {...props} />;
}
