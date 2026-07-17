"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

function DateRangePickerBase({
  label = "Select Date Range", error, helperText, tooltip, disabled,
  placeholder = "Pick date range", id, is_required, value, onChange, onBlur,
  minDate, maxDate, clearable = true, dateFormat = "LLL dd, y", dir = "ltr", className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value && (value.from || value.to)) {
      setDateRange({ from: value.from ? new Date(value.from) : undefined, to: value.to ? new Date(value.to) : undefined });
    } else { setDateRange({ from: undefined, to: undefined }); }
  }, [value]);

  const handleSelect = (range) => {
    if (disabled) return;
    setDateRange(range || { from: undefined, to: undefined });
    if (onChange) onChange({ from: range?.from ? range.from.toISOString() : null, to: range?.to ? range.to.toISOString() : null });
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setDateRange({ from: undefined, to: undefined });
    if (onChange) onChange({ from: null, to: null });
  };

  const formatDisplay = () => {
    if (!dateRange.from) return placeholder;
    if (!dateRange.to) return format(dateRange.from, dateFormat);
    return `${format(dateRange.from, dateFormat)} – ${format(dateRange.to, dateFormat)}`;
  };

  const displayError = error;
  const hasValue = dateRange.from !== undefined;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label htmlFor={inputId} className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground", displayError && "text-destructive", disabled && "opacity-50")}>
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

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" disabled={disabled}
            className={cn(
              "w-full h-9 justify-start text-left font-normal border border-input bg-background hover:bg-accent/50 text-sm px-3 rounded-lg gap-2",
              displayError && "border-destructive focus-visible:ring-destructive/20",
              !hasValue && "text-muted-foreground"
            )}
            {...props}
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 truncate">{formatDisplay()}</span>
            {clearable && hasValue && !disabled && (
              <span onClick={handleClear} className="ml-auto p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="range" selected={dateRange} onSelect={handleSelect} initialFocus numberOfMonths={2} />
        </PopoverContent>
      </Popover>

      {(helperText || displayError) && (
        <div className="text-[11px] px-0.5">
          {displayError ? <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">{displayError}</span>
            : <span className="text-muted-foreground">{helperText}</span>}
        </div>
      )}
    </div>
  );
}

export default function DateRangePicker({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <DateRangePickerBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <DateRangePickerBase {...props} />;
}
