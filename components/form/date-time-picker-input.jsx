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
import { HelpCircle, Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

function DateTimePickerInputBase({
  label = "Select Date & Time", error, helperText, tooltip, disabled,
  placeholder = "Pick date & time", id, is_required, value, onChange, onBlur,
  minDate, maxDate, clearable = true, dateFormat = "PPP p", dir = "ltr", className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [ampm, setAmpm] = useState("PM");

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setSelectedDateTime(parsed);
        let h = parsed.getHours();
        const m = parsed.getMinutes().toString().padStart(2, "0");
        const period = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        setHours(h.toString().padStart(2, "0"));
        setMinutes(m);
        setAmpm(period);
      } else { setSelectedDateTime(null); }
    } else { setSelectedDateTime(null); }
  }, [value]);

  const updateDateTime = (date, h = hours, m = minutes, period = ampm) => {
    if (!date) return;
    const newDate = new Date(date);
    let hourNum = parseInt(h, 10);
    const minuteNum = parseInt(m, 10);
    if (period === "PM" && hourNum < 12) hourNum += 12;
    if (period === "AM" && hourNum === 12) hourNum = 0;
    newDate.setHours(hourNum, minuteNum, 0, 0);
    setSelectedDateTime(newDate);
    if (onChange) onChange(newDate.toISOString());
  };

  const handleDateSelect = (date) => { if (disabled || !date) return; updateDateTime(date); };

  const handleTimeChange = (type, val) => {
    if (disabled || !selectedDateTime) return;
    let newH = hours, newM = minutes, newPeriod = ampm;
    if (type === "hours") { newH = val; setHours(val); }
    else if (type === "minutes") { newM = val; setMinutes(val); }
    else if (type === "ampm") { newPeriod = val; setAmpm(val); }
    updateDateTime(selectedDateTime, newH, newM, newPeriod);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setSelectedDateTime(null);
    if (onChange) onChange(null);
  };

  const displayError = error;
  const hasValue = selectedDateTime !== null;

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
            <span className="flex-1 truncate">{selectedDateTime ? format(selectedDateTime, dateFormat) : placeholder}</span>
            {clearable && hasValue && !disabled && (
              <span onClick={handleClear} className="ml-auto p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row" align="start">
          <div className="border-b sm:border-b-0 sm:border-r border-input">
            <Calendar mode="single" selected={selectedDateTime} onSelect={handleDateSelect} initialFocus />
          </div>
          <div className="p-4 flex flex-col justify-center items-center gap-3 min-w-[140px]">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Time</span>
            <div className="flex items-center gap-1.5">
              <select value={hours} onChange={(e) => handleTimeChange("hours", e.target.value)} disabled={disabled || !hasValue}
                className="bg-background border border-input rounded-md p-1 text-sm font-medium focus:ring-1 focus:ring-ring outline-none cursor-pointer">
                {Array.from({ length: 12 }).map((_, i) => { const v = (i + 1).toString().padStart(2, "0"); return <option key={i} value={v}>{v}</option>; })}
              </select>
              <span className="font-bold text-muted-foreground">:</span>
              <select value={minutes} onChange={(e) => handleTimeChange("minutes", e.target.value)} disabled={disabled || !hasValue}
                className="bg-background border border-input rounded-md p-1 text-sm font-medium focus:ring-1 focus:ring-ring outline-none cursor-pointer">
                {Array.from({ length: 60 }).map((_, i) => { const v = i.toString().padStart(2, "0"); return <option key={i} value={v}>{v}</option>; })}
              </select>
              <select value={ampm} onChange={(e) => handleTimeChange("ampm", e.target.value)} disabled={disabled || !hasValue}
                className="bg-background border border-input rounded-md p-1 text-sm font-medium focus:ring-1 focus:ring-ring outline-none cursor-pointer">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            {!hasValue && <span className="text-[10px] text-muted-foreground text-center max-w-[100px]">Pick a date first</span>}
          </div>
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

export default function DateTimePickerInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <DateTimePickerInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <DateTimePickerInputBase {...props} />;
}
