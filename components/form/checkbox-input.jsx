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
  disabled, id, is_required, checked, onChange, className, ...props
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

function CheckboxInputGroup({
  title, options = [], value = [], onChange, disabled, error, helperText,
  is_required, className, ...props
}) {
  const handleToggle = (optionId) => {
    if (disabled) return;
    const isSelected = value.includes(optionId);
    const newValue = isSelected
      ? value.filter((v) => v !== optionId)
      : [...value, optionId];
    onChange?.(newValue);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title && (
        <Label className={cn("text-sm font-medium", error && "text-destructive", disabled && "opacity-50")}>
          {title}
          {is_required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="space-y-2">
        {options.map((option) => {
          const optionChecked = value.includes(option.id);
          return (
            <CheckboxInputBase
              key={option.id}
              {...props}
              title={option.title}
              icon={option.icon}
              checked={optionChecked}
              onChange={() => handleToggle(option.id)}
              disabled={disabled || option.disabled}
            />
          );
        })}
      </div>
      {(helperText || error) && (
        <div className="text-[11px] px-0.5">
          {error ? <span className="text-destructive font-medium">{error}</span>
            : <span className="text-muted-foreground">{helperText}</span>}
        </div>
      )}
    </div>
  );
}

export default function CheckboxInput({ name, options, ...props }) {
  const formContext = useFormContext();

  if (options) {
    if (formContext && name) {
      return (
        <Controller name={name} control={formContext.control}
          render={({ field, fieldState: { error } }) => (
            <CheckboxInputGroup
              options={options}
              error={error?.message || props.error}
              {...field}
              {...props}
            />
          )}
        />
      );
    }
    return <CheckboxInputGroup options={options} {...props} />;
  }

  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        defaultValue={0}
        render={({ field, fieldState: { error } }) => (
          <CheckboxInputBase
            {...field}
            {...props}
            checked={field.value === 1}
            onChange={(checked) => field.onChange(checked ? 1 : 0)}
            error={error?.message || props.error}
          />
        )}
      />
    );
  }
  return <CheckboxInputBase {...props} />;
}
