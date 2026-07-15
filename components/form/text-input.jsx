"use client";

import * as React from "react";
import { useState, useId, useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { HelpCircle, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

// Helper function to validate input
const validateInputText = ({
  inputValue,
  type,
  allowedPattern,
  blockedPattern,
  allowedSymbols,
  blockedSymbols,
  allowNumbers,
  allowLetters,
  customValidator,
}) => {
  if (!inputValue) return { isValid: true, errorMessage: "" };

  let isValid = true;
  let errorMessage = "";

  if (customValidator) {
    const customResult = customValidator(inputValue);
    if (typeof customResult === "string") {
      isValid = false;
      errorMessage = customResult;
    } else if (customResult === false) {
      isValid = false;
      errorMessage = "Invalid input";
    }
  }

  if (isValid && type === "text") {
    // Blocked symbols
    if (blockedSymbols) {
      const escapedSymbols = blockedSymbols.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const blockedRegex = new RegExp(`[${escapedSymbols}]`);
      if (blockedRegex.test(inputValue)) {
        isValid = false;
        errorMessage = `These symbols are not allowed: ${blockedSymbols}`;
      }
    }

    // Allowed characters (letters, numbers, symbols)
    if (isValid && (allowLetters || allowNumbers || allowedSymbols)) {
      const allowedChars = [];
      const allowedParts = [];

      if (allowLetters) {
        allowedChars.push(
          "a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F",
        );
        allowedParts.push("letters");
      }
      if (allowNumbers) {
        allowedChars.push("0-9");
        allowedParts.push("numbers");
      }
      if (allowedSymbols) {
        const escapedSymbols = allowedSymbols.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        allowedChars.push(escapedSymbols);
        allowedParts.push(`symbols: ${allowedSymbols}`);
      }

      //const dynamicRegex = new RegExp(`^[${allowedChars.join("")}]*$`);
      const dynamicRegex = new RegExp(`^[${allowedChars.join("")}\\s\\-_]*$`);
      if (!dynamicRegex.test(inputValue)) {
        isValid = false;
        if (allowedParts.length === 1) {
          errorMessage = `Only ${allowedParts[0]} are allowed.`;
        } else if (allowedParts.length === 2) {
          errorMessage = `Only ${allowedParts[0]} and ${allowedParts[1]} are allowed.`;
        } else {
          const last = allowedParts.pop();
          errorMessage = `Only ${allowedParts.join(", ")} and ${last} are allowed.`;
        }
      }
    }

    // Blocked pattern
    if (isValid && blockedPattern) {
      const blockedRegex = new RegExp(blockedPattern);
      if (blockedRegex.test(inputValue)) {
        isValid = false;
        errorMessage = "Input contains invalid pattern";
      }
    }

    // Allowed pattern
    if (isValid && allowedPattern && allowedPattern !== ".*") {
      const allowedRegex = new RegExp(allowedPattern);
      if (!allowedRegex.test(inputValue)) {
        isValid = false;
        errorMessage = "Input format is not allowed";
      }
    }

    // Basic number/letter restriction
    if (isValid) {
      if (!allowNumbers && /\d/.test(inputValue)) {
        isValid = false;
        errorMessage = "Numbers are not allowed";
      }
      if (!allowLetters && /[a-zA-Z]/.test(inputValue)) {
        isValid = false;
        errorMessage = "Letters are not allowed";
      }
    }
  }

  return { isValid, errorMessage };
};

function TextInputBase({
  label,
  type = "text",
  icon,
  iconComponent: IconComponent,
  error,
  helperText,
  tooltip,
  disabled,
  placeholder = "",
  maxLength,
  id,
  is_required,
  value,
  onChange,
  onBlur,
  dir = "ltr",
  allowedPattern = ".*",
  blockedPattern = "",
  allowedSymbols,
  blockedSymbols = "",
  allowNumbers = true,
  allowLetters = true,
  customValidator,
  onValidationError,
  className,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const inputRef = useRef(null);

  const [internalValue, setInternalValue] = useState(value ?? "");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;

    const { isValid, errorMessage } = validateInputText({
      inputValue: newValue,
      type,
      allowedPattern,
      blockedPattern,
      allowedSymbols,
      blockedSymbols,
      allowNumbers,
      allowLetters,
      customValidator,
    });

    if (isValid || newValue === "") {
      setInternalValue(newValue);
      setValidationError("");

      if (onChange) {
        onChange(e);
      }
    } else {
      e.preventDefault();
      setValidationError(errorMessage);
      if (onValidationError) {
        onValidationError(errorMessage);
      }
      if (inputRef.current) {
        inputRef.current.value = internalValue;
      }
    }
  };

  const displayError = error || validationError;
  const isRTL = dir === "rtl";

  const LucideIcons =
    !IconComponent && icon ? LucideIcons[icon] || LucideIcons.Circle : null;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label
            htmlFor={inputId}
            className={cn(
              "text-xs tracking-wider text-muted-foreground transition-colors",
              displayError && "text-destructive",
              disabled && "opacity-50",
            )}
          >
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>

          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <LucideIcons.HelpCircle className="h-3.5 w-3.5 text-muted-foreground/75 cursor-pointer hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {/* Input container */}
      <div className="relative w-full">
        <Input
          id={inputId}
          ref={inputRef}
          type={type}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            "w-full h-9 rounded-lg border border-input bg-background text-sm transition-shadow",
            icon && (isRTL ? "pr-9" : "pl-9"),
            displayError &&
              "border-destructive focus-visible:ring-destructive/20",
            isRTL && "text-right",
          )}
          {...props}
        />
      </div>

      {/* Helper text, Character count & Error row */}
      {(helperText || displayError || maxLength) && (
        <div className="flex justify-between items-start text-[11px] px-0.5 gap-4">
          {displayError ? (
            <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">
              {displayError}
            </span>
          ) : helperText ? (
            <span className="text-muted-foreground">{helperText}</span>
          ) : (
            <span />
          )}

          {maxLength && (
            <span className="text-muted-foreground whitespace-nowrap">
              {String(internalValue).length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function TextInput({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <TextInputBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <TextInputBase {...props} />;
}
