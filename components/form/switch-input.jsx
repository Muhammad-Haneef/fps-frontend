"use client";

import * as React from "react";
import { useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function SwitchInputBase({
  label, icon: IconComponent, error, helperText, tooltip,
  disabled = false, checked = false, onChange, onBlur, id, is_required,
  showStatusLabel = false, statusLabels = { on: "On", off: "Off" }, className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleCheckedChange = (isChecked) => {
    if (disabled) return;
    if (onChange) onChange(isChecked);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between gap-4 py-0.5">
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />}
          {label && (
            <div className="flex items-center gap-1.5">
              <Label htmlFor={inputId} className={cn("text-sm font-medium cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed", error && "text-destructive")}>
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
        </div>
        <div className="flex items-center gap-2">
          {showStatusLabel && (
            <span className="text-xs text-muted-foreground">{checked ? statusLabels.on : statusLabels.off}</span>
          )}
          <Switch id={inputId} checked={!!checked} onCheckedChange={handleCheckedChange} disabled={disabled} {...props} />
        </div>
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

function SwitchInputGroup({
  title, options = [], value = [], onChange, disabled, error, helperText,
  is_required, showStatusLabel, statusLabels, className, ...props
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
      <div className="space-y-1">
        {options.map((option) => {
          const optionChecked = value.includes(option.id);
          return (
            <SwitchInputBase
              key={option.id}
              label={option.title}
              icon={option.icon}
              checked={optionChecked}
              onChange={() => handleToggle(option.id)}
              disabled={disabled || option.disabled}
              showStatusLabel={showStatusLabel}
              statusLabels={statusLabels}
              {...props}
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

export default function SwitchInput({ name, options, ...props }) {
  const formContext = useFormContext();

  if (options) {
    if (formContext && name) {
      return (
        <Controller name={name} control={formContext.control}
          render={({ field, fieldState: { error } }) => (
            <SwitchInputGroup
              options={options}
              error={error?.message || props.error}
              {...field}
              {...props}
            />
          )}
        />
      );
    }
    return <SwitchInputGroup options={options} {...props} />;
  }

  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <SwitchInputBase
            {...field}
            checked={field.value === 1}
            onChange={(checked) => field.onChange(checked ? 1 : 0)}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }
  return <SwitchInputBase {...props} />;
}
