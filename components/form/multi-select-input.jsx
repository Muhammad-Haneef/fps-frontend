"use client";

import * as React from "react";
import { useState, useId, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function MultiSelectInputBase({
  label, icon: IconComponent, error, helperText, tooltip,
  disabled, loading = false, placeholder = "Select options...", options = [],
  value = [], onChange, onBlur, id, is_required, clearable = true,
  searchable = true, onCreate, dir = "ltr", className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedOptions = useMemo(() => Array.isArray(options) ? options : [], [options]);
  const selectedValues = useMemo(() => Array.isArray(value) ? value.map(v => String(v)) : [], [value]);
  const selectedItems = useMemo(() => normalizedOptions.filter((opt) => selectedValues.includes(String(opt.id))), [selectedValues, normalizedOptions]);
  const filteredOptions = useMemo(() => {
    const unselected = normalizedOptions.filter((opt) => !selectedValues.includes(String(opt.id)));
    if (!searchTerm) return unselected;
    return unselected.filter((opt) => String(opt.title).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, normalizedOptions, selectedValues]);

  const handleSelect = (option) => {
    if (disabled || loading) return;
    const newValue = [...selectedValues, String(option.id)];
    if (onChange) onChange(newValue);
    setSearchTerm("");
  };

  const handleRemove = (optVal, e) => {
    e.stopPropagation();
    if (disabled || loading) return;
    const newValue = selectedValues.filter((v) => v !== String(optVal));
    if (onChange) onChange(newValue);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled || loading) return;
    if (onChange) onChange([]);
    setSearchTerm("");
  };

  const handleCreate = () => {
    if (!onCreate || !searchTerm) return;
    onCreate(searchTerm);
    setSearchTerm("");
  };

  const displayError = error;
  const isRTL = dir === "rtl";
  const hasValue = selectedValues.length > 0;

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
          <div
            id={inputId}
            className={cn(
              "w-full min-h-[36px] flex flex-wrap gap-1.5 items-center justify-between border border-input rounded-lg bg-background text-sm px-3 py-1.5 cursor-pointer focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-ring transition-all",
              displayError && "border-destructive focus-within:ring-destructive/20",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              isRTL && "flex-row-reverse text-right"
            )}
            {...props}
          >
            <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden">
              {selectedItems.map((item) => (
                <Badge key={item.id} variant="secondary" className="flex items-center gap-1 text-xs pl-2 pr-1 py-0.5 rounded-md font-medium">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate max-w-[120px]">{item.title}</span>
                  {!disabled && (
                    <span onClick={(e) => handleRemove(item.id, e)} className="rounded p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </Badge>
              ))}
              {!hasValue && <span className="text-muted-foreground">{placeholder}</span>}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : (
                <>
                  {clearable && hasValue && !disabled && (
                    <span onClick={handleClear} className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-3.5 w-3.5" /></span>
                  )}
                  <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50 shrink-0" />
                </>
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[200px]" align="start">
          <div className="flex flex-col max-h-[300px]">
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
                  ) : "No options available"}
                </div>
              ) : filteredOptions.map((option) => (
                <div key={option.id} onClick={() => !option.disabled && handleSelect(option)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none transition-colors",
                    option.disabled ? "text-muted-foreground opacity-50 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <span className="truncate">{option.title}</span>
                </div>
              ))}
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

export default function MultiSelectInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelectInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <MultiSelectInputBase {...props} />;
}
