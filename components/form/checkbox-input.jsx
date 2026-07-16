"use client";

import * as React from "react";
import { useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function CheckboxInputBase({
  title, label, icon: IconComponent, error, helperText, tooltip,
  disabled, id, is_required, checked, onChange, arrayMode = false, className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const displayLabel = title || label;

  const handleCheckedChange = (isChecked) => {
    if (disabled) return;
    if (onChange) onChange(isChecked);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2.5">
        <Checkbox
          id={inputId} checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled} {...props}
        />
        {displayLabel && (
          <div className="flex items-center gap-1.5">
            <Label htmlFor={inputId}
              className={cn(
                "text-sm font-medium leading-none cursor-pointer select-none",
                disabled && "opacity-50 cursor-not-allowed",
                error && "text-destructive"
              )}
            >
              {IconComponent && <IconComponent className="h-4 w-4 inline mr-1.5 align-text-bottom text-muted-foreground" />}
              {displayLabel}
              {is_required && <span className="text-destructive ml-1">*</span>}
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
      </div>
      {(helperText || error) && (
        <div className="text-[11px] px-6">
          {error ? <span className="text-destructive font-medium">{error}</span>
            : <span className="text-muted-foreground">{helperText}</span>}
        </div>
      )}
    </div>
  );
}

export default function CheckboxInput({ name, arrayMode = false, value: arrayValue, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    if (arrayMode && arrayValue !== undefined) {
      const selectedValues = formContext.watch(name) || [];
      const isChecked = selectedValues.includes(arrayValue);
      const handleCheckedChange = (checked) => {
        const updatedValues = checked
          ? [...selectedValues, arrayValue]
          : selectedValues.filter((v) => String(v) !== String(arrayValue));
        formContext.setValue(name, updatedValues, { shouldValidate: true });
      };
      return <CheckboxInputBase checked={isChecked} onChange={handleCheckedChange} {...props} />;
    }
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <CheckboxInputBase {...field} checked={!!field.value}
            onChange={(checked) => field.onChange(checked)}
            error={error?.message || props.error} {...props}
          />
        )}
      />
    );
  }
  return <CheckboxInputBase {...props} />;
}
