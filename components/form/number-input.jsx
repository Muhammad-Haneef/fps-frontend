"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function NumberInputBase({
  label,
  icon: IconComponent,
  error,
  helperText,
  tooltip,
  disabled,
  placeholder = "",
  id,
  is_required,
  min,
  max,
  step = 1,
  dropdownOptions = [],
  dropdownProps = {},
  dropdownValue,
  onDropdownChange,
  allowNegative = false,
  allowDecimal = false,
  maxDigits = 20,
  value,
  onChange,
  onBlur,
  dir = "ltr",
  className,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    let inputVal = e.target.value;

    if (!allowNegative && inputVal.startsWith("-")) {
      inputVal = inputVal.replace("-", "");
    }

    const regex = allowDecimal
      ? allowNegative
        ? /^-?\d*\.?\d*$/
        : /^\d*\.?\d*$/
      : allowNegative
      ? /^-?\d*$/
      : /^\d*$/;

    if (!regex.test(inputVal)) return;

    const cleanVal = inputVal.replace("-", "");
    const [integerPart, decimalPart] = cleanVal.split(".");

    if (integerPart && integerPart.length > maxDigits) return;
    if (decimalPart && decimalPart.length > 10) return;

    setInternalValue(inputVal);

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: inputVal,
        },
      });
    }
  };

  const adjustValue = (amount) => {
    if (disabled) return;
    const currentNum = parseFloat(internalValue) || 0;
    let newNum = currentNum + amount;
    
    if (min !== undefined && newNum < min) newNum = min;
    if (max !== undefined && newNum > max) newNum = max;
    
    const stepString = step.toString();
    const decimalPlaces = stepString.includes(".") ? stepString.split(".")[1].length : 0;
    const formattedValue = decimalPlaces > 0 ? newNum.toFixed(decimalPlaces) : newNum.toString();

    setInternalValue(formattedValue);
    
    if (onChange) {
      onChange({
        target: {
          value: formattedValue,
        },
      });
    }
  };

  const displayError = error;
  const isRTL = dir === "rtl";

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label 
            htmlFor={inputId}
            className={cn(
              "text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors",
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

      {/* Input Outer wrapper */}
      <div className={cn(
        "relative w-full flex items-stretch rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition-all overflow-hidden bg-background",
        displayError && "border-destructive focus-within:ring-destructive/20"
      )}>
        {/* Input Left Icon */}
        {IconComponent && !isRTL && (
          <div className="pl-3 flex items-center justify-center text-muted-foreground/70 pointer-events-none">
            <IconComponent className="h-4 w-4" />
          </div>
        )}

        <input
          id={inputId}
          type="text"
          value={internalValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 min-w-0 bg-transparent py-1.5 px-3 text-sm outline-none",
            IconComponent && !isRTL && "pl-2",
            IconComponent && isRTL && "pr-2",
            isRTL && "text-right",
            disabled && "cursor-not-allowed opacity-50"
          )}
          {...props}
        />

        {/* Input Right Icon (RTL) */}
        {IconComponent && isRTL && (
          <div className="pr-3 flex items-center justify-center text-muted-foreground/70 pointer-events-none">
            <IconComponent className="h-4 w-4" />
          </div>
        )}

        {/* Increment / Decrement Spinner Buttons */}
        {!disabled && (
          <div className="flex flex-col border-l border-input">
            <button
              type="button"
              onClick={() => adjustValue(parseFloat(step))}
              className="flex-1 px-1.5 hover:bg-muted text-muted-foreground hover:text-foreground border-b border-input flex items-center justify-center cursor-pointer"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => adjustValue(-parseFloat(step))}
              className="flex-1 px-1.5 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Dropdown Options (Unit Selector like USD, kg, etc.) */}
        {dropdownOptions.length > 0 && (
          <select
            value={dropdownValue}
            onChange={(e) => onDropdownChange?.(e.target.value)}
            disabled={disabled}
            className="px-2 border-l border-input bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground cursor-pointer focus:outline-none"
            {...dropdownProps}
          >
            {dropdownOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error & Helper texts */}
      {(helperText || displayError) && (
        <div className="flex justify-between items-start text-[11px] px-0.5 gap-4">
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

export default function NumberInput({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <NumberInputBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <NumberInputBase {...props} />;
}
