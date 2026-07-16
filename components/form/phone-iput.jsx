"use client";

import * as React from "react";
import { useState, useEffect, useId, useRef, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    maxLength: 10,
    pattern: /^\+1\d{10}$/,
    example: "+1 (234) 567-8900",
  },
  {
    code: "PK",
    name: "Pakistan",
    dialCode: "+92",
    flag: "🇵🇰",
    maxLength: 10,
    pattern: /^\+92\d{10}$/,
    example: "+92 300 1234567",
  },
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    maxLength: 10,
    pattern: /^\+91\d{10}$/,
    example: "+91 98765 43210",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    maxLength: 10,
    pattern: /^\+44\d{10}$/,
    example: "+44 7911 123456",
  },
  {
    code: "AE",
    name: "UAE",
    dialCode: "+971",
    flag: "🇦🇪",
    maxLength: 9,
    pattern: /^\+971\d{9}$/,
    example: "+971 50 123 4567",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    dialCode: "+966",
    flag: "🇸🇦",
    maxLength: 9,
    pattern: /^\+966\d{9}$/,
    example: "+966 55 123 4567",
  },
];

const formatPhoneNumber = (phone, country) => {
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return "";

  switch (country.code) {
    case "US":
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6)
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;

    case "PK":
      if (cleaned.length <= 4) return cleaned;
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 11)}`;

    case "IN":
      if (cleaned.length <= 5) return cleaned;
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;

    case "GB":
      if (cleaned.length <= 4) return cleaned;
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 11)}`;

    case "AE":
    case "SA":
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 5)
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}`;
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`;

    default:
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6)
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  }
};

function PhoneInputBase({
  label = "Phone Number",
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  helperText,
  tooltip,
  placeholder,
  defaultCountry = "PK",
  allowedCountries = [],
  showCountryDropdown = true,
  validateOnChange = true,
  customValidator,
  id,
  is_required,
  className,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [phoneValue, setPhoneValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const availableCountries = useMemo(() => {
    return allowedCountries.length > 0
      ? COUNTRIES.filter((c) => allowedCountries.includes(c.code))
      : COUNTRIES;
  }, [allowedCountries]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return availableCountries;
    return availableCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dialCode.includes(searchTerm)
    );
  }, [searchTerm, availableCountries]);

  // Sync internal display state when external value changes
  useEffect(() => {
    if (value) {
      // If external value includes dialCode, parse it
      let matchedCountry = selectedCountry;
      let localNumber = value;

      for (const country of COUNTRIES) {
        if (value.startsWith(country.dialCode)) {
          matchedCountry = country;
          localNumber = value.replace(country.dialCode, "").trim();
          break;
        }
      }

      setSelectedCountry(matchedCountry);
      setPhoneValue(formatPhoneNumber(localNumber, matchedCountry));
    } else {
      setPhoneValue("");
    }
  }, [value]);

  const validatePhone = (digits, country) => {
    const fullNumber = country.dialCode + digits;
    let err = "";

    if (customValidator) {
      const result = customValidator(fullNumber, country, digits);
      if (typeof result === "string") err = result;
      else if (result === false) err = "Invalid phone number";
    }

    if (!err && country.pattern && !country.pattern.test(fullNumber)) {
      err = `Please enter a valid ${country.name} phone number`;
    }

    setValidationError(err);
    return !err;
  };

  const handlePhoneChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, selectedCountry.maxLength);
    const formatted = formatPhoneNumber(rawDigits, selectedCountry);
    setPhoneValue(formatted);

    let isValid = true;
    if (validateOnChange) {
      isValid = validatePhone(rawDigits, selectedCountry);
    }

    const fullInternationalNumber = selectedCountry.dialCode + rawDigits;

    if (onChange) {
      // Send the full international dialcode + digits to form values
      onChange(fullInternationalNumber);
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm("");

    if (phoneValue) {
      const raw = phoneValue.replace(/\D/g, "");
      const formatted = formatPhoneNumber(raw, country);
      setPhoneValue(formatted);
      validatePhone(raw, country);

      if (onChange) {
        onChange(country.dialCode + raw);
      }
    }
  };

  const displayError = error || validationError;
  const defaultPlaceholder = selectedCountry.example
    ? selectedCountry.example.split(" ").slice(1).join(" ")
    : "Phone number";

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className={cn("text-sm font-medium", displayError && "text-destructive", disabled && "opacity-50")}>
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>

          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {/* Input container box */}
      <div className={cn(
        "relative w-full flex items-stretch rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition-all overflow-hidden bg-background",
        displayError && "border-destructive focus-within:ring-destructive/20"
      )}>
        {/* Country selector */}
        {showCountryDropdown && (
          <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                className="h-9 px-3 rounded-none border-r border-input bg-muted hover:bg-muted/80 text-sm font-medium shrink-0 flex gap-1.5 items-center cursor-pointer"
              >
                <span className="text-base select-none">{selectedCountry.flag}</span>
                <span className="text-xs font-semibold">{selectedCountry.dialCode}</span>
                <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-64 max-h-72 flex flex-col" align="start">
              <div className="flex items-center border-b border-input px-3 py-2 bg-background">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-transparent outline-none border-0 placeholder:text-muted-foreground py-0.5"
                />
              </div>
              <div className="overflow-y-auto flex-1 py-1">
                {filteredCountries.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => handleCountryChange(c)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-xs cursor-pointer select-none transition-colors hover:bg-accent hover:text-accent-foreground",
                      selectedCountry.code === c.code && "bg-accent/50 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg select-none">{c.flag}</span>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold truncate">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground">{c.dialCode}</span>
                      </div>
                    </div>
                    {selectedCountry.code === c.code && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Dial Code Prefix in case dropdown is hidden */}
        {!showCountryDropdown && (
          <div className="pl-3 pr-1.5 flex items-center justify-center text-muted-foreground text-sm font-medium pointer-events-none select-none">
            {selectedCountry.dialCode}
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          type="tel"
          value={phoneValue}
          onChange={handlePhoneChange}
          disabled={disabled}
          placeholder={placeholder || defaultPlaceholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent py-1.5 px-3 text-sm outline-none",
            disabled && "cursor-not-allowed opacity-50"
          )}
          {...props}
        />
      </div>

      {/* Flag format instructions indicator */}
      {!disabled && selectedCountry && (
        <span className="text-[10px] text-muted-foreground px-0.5">
          Country format example: {selectedCountry.example}
        </span>
      )}

      {/* Error & Helper */}
      {(helperText || displayError) && (
        <div className="text-xs px-0.5">
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

export default function PhoneInput({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <PhoneInputBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <PhoneInputBase {...props} />;
}
