"use client";

import * as React from "react";
import { useState, useId, useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function OtpInputBase({
  label, error, helperText, tooltip, disabled, length = 6, id, is_required,
  value = "", onChange, onBlur, onComplete, dir = "ltr", inputType = "numeric", className, ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [otpValues, setOtpValues] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const charArray = String(value).split("").slice(0, length);
      const padded = [...charArray, ...Array(length - charArray.length).fill("")];
      setOtpValues(padded);
    }
  }, [value, length]);

  const handleChange = (index, val) => {
    if (disabled) return;
    const isNumeric = inputType === "numeric";
    if (isNumeric && !/^\d*$/.test(val)) return;

    const newValues = [...otpValues];
    newValues[index] = val.slice(-1);
    setOtpValues(newValues);

    const joined = newValues.join("");
    if (onChange) onChange(joined);
    if (joined.length === length && onComplete) onComplete(joined);

    if (val && index < length - 1) { inputRefs.current[index + 1]?.focus(); }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) { inputRefs.current[index - 1]?.focus(); }
      else {
        const newValues = [...otpValues];
        newValues[index] = "";
        setOtpValues(newValues);
        const joined = newValues.join("");
        if (onChange) onChange(joined);
      }
    } else if (e.key === "ArrowLeft" && index > 0) { inputRefs.current[index - 1]?.focus(); }
    else if (e.key === "ArrowRight" && index < length - 1) { inputRefs.current[index + 1]?.focus(); }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (disabled) return;
    const pasted = e.clipboardData.getData("text").trim();
    const cleaned = inputType === "numeric" ? pasted.replace(/\D/g, "") : pasted;
    const sliced = cleaned.split("").slice(0, length);
    const newValues = [...Array(length).fill("").map((_, i) => sliced[i] || "")];
    setOtpValues(newValues);
    const joined = newValues.join("");
    if (onChange) onChange(joined);
    if (joined.length === length && onComplete) onComplete(joined);
    inputRefs.current[Math.min(sliced.length, length - 1)]?.focus();
  };

  const displayError = error;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label htmlFor={inputId} className={cn("text-xs font-semibold tracking-wider text-muted-foreground", displayError && "text-destructive", disabled && "opacity-50")}>
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

      <div id={inputId} className="flex gap-2 items-center flex-wrap" onPaste={handlePaste}>
        {otpValues.map((val, index) => (
          <input
            key={index}
            type={inputType === "password" ? "password" : "text"}
            inputMode={inputType === "numeric" ? "numeric" : "text"}
            pattern={inputType === "numeric" ? "[0-9]*" : undefined}
            maxLength={1}
            value={val}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            aria-label={`OTP digit ${index + 1}`}
            className={cn(
              "w-10 h-11 text-center text-lg font-mono font-semibold border border-input rounded-lg bg-background text-foreground",
              "focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring transition-all",
              displayError && "border-destructive focus-visible:ring-destructive/20",
              disabled && "opacity-50 cursor-not-allowed bg-muted",
              val && "bg-accent/30"
            )}
          />
        ))}
      </div>

      {(helperText || displayError) && (
        <div className="text-[11px] px-0.5">
          {displayError ? <span className="text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1 duration-200">{displayError}</span>
            : <span className="text-muted-foreground">{helperText}</span>}
        </div>
      )}
    </div>
  );
}

export default function OtpInput({ name, ...props }) {
  const formContext = useFormContext();
  if (formContext && name) {
    return (
      <Controller name={name} control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <OtpInputBase {...field} error={error?.message || props.error} {...props} />
        )}
      />
    );
  }
  return <OtpInputBase {...props} />;
}
