"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Password strength evaluator
const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: "", color: "bg-muted" };
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[a-z]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/\d/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  switch (score) {
    case 1:
      return { score, label: "Very Weak", color: "bg-destructive" };
    case 2:
      return { score, label: "Weak", color: "bg-orange-500" };
    case 3:
      return { score, label: "Medium", color: "bg-amber-500" };
    case 4:
      return { score, label: "Strong", color: "bg-yellow-500" };
    case 5:
      return { score, label: "Very Strong", color: "bg-emerald-500" };
    default:
      return { score: 0, label: "", color: "bg-muted" };
  }
};

function PasswordInputBase({
  label,
  icon: IconComponent,
  error,
  helperText,
  tooltip,
  disabled,
  placeholder = "",
  id,
  is_required,
  value,
  onChange,
  onBlur,
  dir = "ltr",
  showStrengthIndicator = false,
  className,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [internalValue, setInternalValue] = useState(value ?? "");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setInternalValue(newVal);
    if (onChange) onChange(e);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const strength = getPasswordStrength(internalValue);
  const displayError = error;
  const isRTL = dir === "rtl";

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} dir={dir}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label
            htmlFor={inputId}
            className={cn(
              "text-xs font-semibold tracking-wider text-muted-foreground transition-colors",
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
        {/* Lock Icon / Custom Left Icon */}
        {!isRTL && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
            {IconComponent ? (
              <IconComponent className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </div>
        )}

        <Input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={internalValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full h-9 rounded-lg border border-input bg-background text-sm pr-9 pl-9",
            isRTL && "text-right",
            displayError && "border-destructive focus-visible:ring-destructive/20",
            className
          )}
          {...props}
        />

        {/* Eye/Toggle Right Icon */}
        <button
          type="button"
          onClick={toggleShowPassword}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Strength indicator bar */}
      {showStrengthIndicator && internalValue && !disabled && (
        <div className="flex flex-col gap-1 mt-0.5">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Password Strength:</span>
            <span className="font-semibold">{strength.label}</span>
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-full flex-1 transition-all duration-300",
                  idx < strength.score ? strength.color : "bg-muted/30"
                )}
              />
            ))}
          </div>
        </div>
      )}

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

export default function PasswordInput({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <PasswordInputBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <PasswordInputBase {...props} />;
}
