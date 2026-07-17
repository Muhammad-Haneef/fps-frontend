// "use client";

import * as React from "react";
import { useState, useId, useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
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
  customValidator
}) => {
  if (!inputValue) return { isValid: true, errorMessage: "" };

  let isValid = true;
  let errorMessage = "";

  // custom validator
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
      const escapedSymbols = blockedSymbols.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const blockedRegex = new RegExp(`[${escapedSymbols}]`);
      if (blockedRegex.test(inputValue)) {
        isValid = false;
        errorMessage = `These symbols are not allowed: ${blockedSymbols}`;
      }
    }

    // *** FIX: only enforce allowed characters if at least one restriction is explicitly set ***
    const hasAllowedRestriction =
      allowLetters === true || allowNumbers === true || !!allowedSymbols;

    if (isValid && hasAllowedRestriction) {
      const allowedChars = [];
      const allowedParts = [];

      if (allowLetters === true) {
        allowedChars.push("a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F");
        allowedParts.push("letters");
      }
      if (allowNumbers === true) {
        allowedChars.push("0-9");
        allowedParts.push("numbers");
      }
      if (allowedSymbols) {
        const escapedSymbols = allowedSymbols.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        allowedChars.push(escapedSymbols);
        allowedParts.push(`symbols: ${allowedSymbols}`);
      }

      if (allowedChars.length > 0) {
        const dynamicRegex = new RegExp(`^[${allowedChars.join("")}]*$`);
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

    // *** FIX: only block numbers/letters if explicitly set to false ***
    if (isValid) {
      if (allowNumbers === false && /\d/.test(inputValue)) {
        isValid = false;
        errorMessage = "Numbers are not allowed";
      }
      if (allowLetters === false && /[a-zA-Z]/.test(inputValue)) {
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
  icon: IconComponent,
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
  allowedPattern = "",
  blockedPattern = "",
  allowedSymbols,
  blockedSymbols = "",
  // *** FIX: default to undefined instead of true ***
  allowNumbers,
  allowLetters,
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
      customValidator
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
      // revert input display
      if (inputRef.current) {
        inputRef.current.value = internalValue;
      }
    }
  };

  const displayError = error || validationError;
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

      {/* Input container */}
      <div className="relative w-full">
        {/* Input Left Icon */}
        {IconComponent && !isRTL && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
            <IconComponent className="h-4 w-4" />
          </div>
        )}

        {/* Input Right Icon (RTL) */}
        {IconComponent && isRTL && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
            <IconComponent className="h-4 w-4" />
          </div>
        )}

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
            IconComponent && (isRTL ? "pr-9" : "pl-9"),
            displayError && "border-destructive focus-visible:ring-destructive/20",
            isRTL && "text-right"
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