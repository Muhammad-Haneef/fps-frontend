"use client";

import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function YearPickerBase({
  label,
  error,
  helperText,
  tooltip,
  disabled = false,
  value,
  onChange,
  onBlur,
  id,
  is_required,
  className,
  placeholder = "Select year",
  minYear = 1900,
  maxYear = 2100,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDecade, setDisplayDecade] = useState(
    value ? Math.floor(value / 10) * 10 : Math.floor(new Date().getFullYear() / 10) * 10
  );

  const years = Array.from({ length: 12 }, (_, i) => displayDecade + i);

  const handlePrevDecade = () => {
    setDisplayDecade(displayDecade - 10);
  };

  const handleNextDecade = () => {
    setDisplayDecade(displayDecade + 10);
  };

  const handleYearSelect = (year) => {
    onChange?.(year);
    setIsOpen(false);
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {label && (
        <Label className={cn("text-sm font-medium", error && "text-destructive", disabled && "opacity-50")}>
          {label}
          {is_required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {value || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            {/* Decade Navigation */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevDecade}
                disabled={displayDecade <= minYear}
                className="h-7 w-7"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold">
                {displayDecade} - {displayDecade + 11}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextDecade}
                disabled={displayDecade + 11 >= maxYear}
                className="h-7 w-7"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Year Grid */}
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => {
                const isSelected = value === year;
                const isDisabled = year < minYear || year > maxYear;
                const isCurrentYear = year === new Date().getFullYear();

                return (
                  <Button
                    key={year}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => !isDisabled && handleYearSelect(year)}
                    disabled={isDisabled}
                    className={cn(
                      "h-10",
                      isCurrentYear && !isSelected && "border border-primary",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                  >
                    {year}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {(helperText || error) && (
        <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default function YearPicker({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <YearPickerBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <YearPickerBase {...props} />;
}
