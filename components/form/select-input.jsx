"use client";

import * as React from "react";
import { useState, useId, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, ChevronsUpDown, X, Loader2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable select input.
 * - Built-in search
 * - Single-select by default
 * - Pass `multiple` to enable multi-select
 * - Multi-select renders selections as removable pills in the trigger
 * - All values (incoming `value` prop, option values, emitted onChange)
 *   are normalized to strings, since option data (e.g. numeric API ids)
 *   often disagrees in type with string-based form schemas.
 *
 * Works standalone (controlled via `value`/`onChange`) or automatically
 * wires into react-hook-form when rendered inside a FormProvider and
 * given a `name`.
 */
function SelectInputBase({
  label,
  error,
  helperText,
  tooltip,
  disabled,
  loading = false,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  options = [],
  multiple = false,
  value,
  onChange,
  id,
  is_required,
  clearable = true,
  maxPillsShown = 3,
  className,
  // Field accessors — override these if your option objects don't use
  // {value, label}, e.g. valueKey="id" labelKey="title". Every place that
  // reads an option field goes through these two functions so the display,
  // selection-matching, and search can never fall out of sync with each other.
  valueKey = "id",
  labelKey = "title",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);

  // Single source of truth for reading an option's value — always
  // returns a string (or null/undefined), so every downstream
  // comparison, key, and emitted value stays type-consistent.
  const getValue = (opt) => {
    const v = opt?.[valueKey];
    return v === null || v === undefined ? v : String(v);
  };
  const getLabel = (opt) => opt?.[labelKey];

  const normalizedOptions = useMemo(
    () => (Array.isArray(options) ? options : []),
    [options]
  );

  // Normalize value into a string array internally so single/multi share
  // one code path, and so incoming numbers (e.g. from raw API records)
  // are coerced to strings just like everything else in this component.
  const selectedValues = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value.map((v) => String(v)) : [];
    }
    return value !== undefined && value !== null && value !== ""
      ? [String(value)]
      : [];
  }, [value, multiple]);

  const selectedOptions = useMemo(
    () =>
      normalizedOptions.filter((opt) =>
        selectedValues.some((v) => v === getValue(opt))
      ),
    [normalizedOptions, selectedValues]
  );

  const isSelected = (optionValue) =>
    selectedValues.some((v) => v === optionValue);

  const emitChange = (nextValues) => {
    if (!onChange) return;
    onChange(multiple ? nextValues : nextValues[0] ?? "");
  };

  const handleToggle = (option) => {
    if (disabled || loading || option.disabled) return;
    const optionValue = getValue(option); // already a string

    if (multiple) {
      const alreadySelected = isSelected(optionValue);
      const next = alreadySelected
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      emitChange(next);
      // keep popover open for multi-select so people can pick several
    } else {
      emitChange([optionValue]);
      setIsOpen(false);
    }
  };

  const handleRemovePill = (e, optionValue) => {
    e.stopPropagation();
    if (disabled || loading) return;
    emitChange(selectedValues.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (disabled || loading) return;
    emitChange([]);
  };

  // Stops the outer trigger Button from reacting to pointer-down before
  // our onClick runs — prevents the popover from toggling/reopening
  // when removing a pill or clearing the selection.
  const stopEarly = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const displayError = error;
  const hasValue = selectedValues.length > 0;
  const visiblePills = multiple ? selectedOptions.slice(0, maxPillsShown) : [];
  const overflowCount = multiple
    ? Math.max(selectedOptions.length - maxPillsShown, 0)
    : 0;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label
            htmlFor={inputId}
            className={cn(
              "text-xs tracking-wider text-muted-foreground",
              displayError && "text-destructive",
              disabled && "opacity-50"
            )}
          >
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/75 cursor-pointer hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled || loading}
            className={cn(
              "w-full min-h-9 h-auto justify-between text-left font-normal border border-input bg-background hover:bg-accent/50 text-sm px-3 rounded-lg",
              displayError && "border-destructive focus-visible:ring-destructive/20",
              !hasValue && "text-muted-foreground"
            )}
            {...props}
          >
            <div className="flex flex-1 items-center gap-1 flex-wrap overflow-hidden py-0.5">
              {!hasValue && <span className="truncate">{placeholder}</span>}

              {!multiple && hasValue && (
                <span className="truncate">{getLabel(selectedOptions[0])}</span>
              )}

              {multiple &&
                visiblePills.map((opt) => (
                  <Badge
                    key={getValue(opt)}
                    variant="secondary"
                    className="gap-1 pl-2 pr-1 font-normal"
                  >
                    <span className="truncate max-w-[120px]">{getLabel(opt)}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      onMouseDown={stopEarly}
                      onClick={(e) => handleRemovePill(e, getValue(opt))}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}

              {multiple && overflowCount > 0 && (
                <Badge variant="secondary" className="font-normal">
                  +{overflowCount} more
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {clearable && hasValue && (
                    <span
                      role="button"
                      tabIndex={-1}
                      onMouseDown={stopEarly}
                      onClick={handleClearAll}
                      className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50 shrink-0" />
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[200px]"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-[280px]">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {normalizedOptions.map((option) => {
                  const selected = isSelected(getValue(option));
                  return (
                    <CommandItem
                      key={getValue(option)}
                      value={String(getLabel(option))}
                      disabled={option.disabled}
                      onSelect={() => handleToggle(option)}
                      className={cn(
                        "flex items-center justify-between gap-2 cursor-pointer",
                        selected && "font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {option.icon && (
                          <span className="shrink-0">{option.icon}</span>
                        )}
                        <span className="truncate">{getLabel(option)}</span>
                      </div>
                      {selected && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {(helperText || displayError) && (
        <div className="flex justify-between items-start text-[11px] px-0.5">
          {displayError ? (
            <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">
              {displayError}
            </span>
          ) : (
            <span className="text-muted-foreground">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function SelectInput({ name, multiple = false, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        defaultValue={multiple ? [] : ""}
        render={({ field, fieldState: { error } }) => (
          <SelectInputBase
            {...props}
            multiple={multiple}
            value={field.value}
            onChange={field.onChange}
            error={error?.message || props.error}
          />
        )}
      />
    );
  }

  return <SelectInputBase multiple={multiple} {...props} />;
}