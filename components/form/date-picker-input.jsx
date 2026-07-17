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

function DatePickerInputBase({
  label, error, helperText, tooltip, disabled, placeholder = "Pick a date",
  id, is_required, value, onChange, onBlur, minDate, maxDate,
  clearable = true, dateFormat = "PPP", dir = "ltr", className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) { setSelectedDate(parsed); }
      else { setSelectedDate(null); }
    } else { setSelectedDate(null); }
  }, [value]);

  const handleSelect = (date) => {
    if (disabled) return;
    setSelectedDate(date);
    setIsOpen(false);
    if (onChange) onChange(date ? date.toISOString() : null);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setSelectedDate(null);
    if (onChange) onChange(null);
  };

  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const displayError = error;
  const isRTL = dir === "rtl";
  const hasValue = selectedDate !== null;

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
          <Button
            id={inputId} variant="outline" disabled={disabled}
            className={cn(
              "w-full h-9 justify-start text-left font-normal border border-input bg-background hover:bg-accent/50 text-sm px-3 rounded-lg gap-2",
              displayError && "border-destructive focus-visible:ring-destructive/20",
              !hasValue && "text-muted-foreground"
            )}
            {...props}
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 truncate">{selectedDate ? format(selectedDate, dateFormat) : placeholder}</span>
            {clearable && hasValue && !disabled && (
              <span onClick={handleClear} className="ml-auto p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} disabled={isDateDisabled} initialFocus />
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

export default function DatePickerInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <DatePickerInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <DatePickerInputBase {...props} />;
}
