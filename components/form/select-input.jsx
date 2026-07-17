"use client";

import * as React from "react";
import { useState, useId, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function SelectInputBase({
  label, icon: IconComponent, error, helperText, tooltip,
  disabled, loading = false, placeholder = "Select an option...", options = [],
  value, onChange, onBlur, id, is_required, clearable = true, searchable = true,
  onCreate, optionEnd, dir = "ltr", className,
  valueKey = "id",      // 👈 new prop
  labelKey = "title",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedOptions = useMemo(() => Array.isArray(options) ? options : [], [options]);

  const selectedOption = useMemo(() => normalizedOptions.find((opt) => String(opt[valueKey]) === String(value)), [value, normalizedOptions]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return normalizedOptions;
    return normalizedOptions.filter((opt) => String(opt[labelKey]).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, normalizedOptions]);

  const handleSelect = (option) => {
    if (disabled || loading) return;
    if (onChange) onChange(option[valueKey]);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled || loading) return;
    if (onChange) onChange("");
    setSearchTerm("");
  };

  const handleCreate = () => {
    if (!onCreate || !searchTerm) return;
    onCreate(searchTerm);
    setIsOpen(false);
    setSearchTerm("");
  };

  const displayError = error;
  const isRTL = dir === "rtl";
  const hasValue = value !== undefined && value !== null && value !== "";

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
            id={inputId} variant="outline" disabled={disabled || loading}
            className={cn(
              "w-full h-9 justify-between text-left font-normal border border-input bg-background hover:bg-accent/50 text-sm px-3 rounded-lg",
              displayError && "border-destructive focus-visible:ring-destructive/20",
              !hasValue && "text-muted-foreground",
              isRTL && "flex-row-reverse text-right"
            )}
            {...props}
          >
            <div className="flex items-center gap-2 overflow-hidden truncate">
              {IconComponent && !isRTL && <IconComponent className="h-4 w-4 shrink-0 text-muted-foreground" />}
              <span className="truncate">{selectedOption ? selectedOption[labelKey] : placeholder}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : (
                <>
                  {clearable && hasValue && <span onClick={handleClear} className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-3.5 w-3.5" /></span>}
                  <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50 shrink-0" />
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[200px]" align="start">
          <div className="relative flex flex-col max-h-[300px]">
            {searchable && (
              <div className="flex items-center border-b border-input px-3 py-2 bg-background z-10">
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm bg-transparent outline-none border-0 placeholder:text-muted-foreground py-0.5" />
                {searchTerm && <X className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => setSearchTerm("")} />}
              </div>
            )}
            <div className="overflow-y-auto flex-1 py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2.5 text-sm text-center text-muted-foreground">
                  {onCreate && searchTerm ? (
                    <button onClick={handleCreate} className="w-full text-primary font-medium text-xs py-1 hover:underline cursor-pointer">Create "{searchTerm}"</button>
                  ) : "No options found"}
                </div>
              ) : filteredOptions.map((option) => {
                const isSelected = String(option[valueKey]) === String(value);
                return (
                  <div key={option[valueKey]} onClick={() => !option.disabled && handleSelect(option)}
                    className={cn(
                      "relative flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none transition-colors",
                      option.disabled ? "text-muted-foreground opacity-50 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent/50 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && <span className="shrink-0">{option.icon}</span>}
                      <span className="truncate">{option[labelKey]}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {optionEnd && optionEnd(option)}
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {(helperText || displayError) && (
        <div className="flex justify-between items-start text-[11px] px-0.5">
          {displayError ? <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">{displayError}</span>
            : <span className="text-muted-foreground">{helperText}</span>}
        </div>
      )}
    </div>
  );
}

export default function SelectInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <SelectInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <SelectInputBase {...props} />;
}
