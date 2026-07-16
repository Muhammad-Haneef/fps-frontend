"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SwitchInput } from "./switch-input";
import { cn } from "@/lib/utils";
import { Copy, Trash2 } from "lucide-react";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
];

function WeekTimingInputBase({
  label,
  error,
  helperText,
  tooltip,
  disabled = false,
  value = {},
  onChange,
  onBlur,
  id,
  is_required,
  className,
  allowMultipleSlots = true,
  timeFormat = "24h", // "12h" or "24h"
  ...props
}) {
  // Initialize default value structure
  const schedule = DAYS.reduce((acc, day) => {
    acc[day.key] = value[day.key] || {
      enabled: false,
      slots: [{ start: "09:00", end: "17:00" }]
    };
    return acc;
  }, {});

  const handleDayToggle = (dayKey, enabled) => {
    const updated = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        enabled
      }
    };
    onChange?.(updated);
  };

  const handleTimeChange = (dayKey, slotIndex, field, time) => {
    const updated = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        slots: schedule[dayKey].slots.map((slot, i) =>
          i === slotIndex ? { ...slot, [field]: time } : slot
        )
      }
    };
    onChange?.(updated);
  };

  const handleAddSlot = (dayKey) => {
    const updated = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        slots: [...schedule[dayKey].slots, { start: "09:00", end: "17:00" }]
      }
    };
    onChange?.(updated);
  };

  const handleRemoveSlot = (dayKey, slotIndex) => {
    if (schedule[dayKey].slots.length <= 1) return;
    
    const updated = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        slots: schedule[dayKey].slots.filter((_, i) => i !== slotIndex)
      }
    };
    onChange?.(updated);
  };

  const handleCopyToAll = (dayKey) => {
    const sourceDay = schedule[dayKey];
    const updated = DAYS.reduce((acc, day) => {
      acc[day.key] = {
        enabled: sourceDay.enabled,
        slots: sourceDay.slots.map(slot => ({ ...slot }))
      };
      return acc;
    }, {});
    onChange?.(updated);
  };

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      {label && (
        <Label className={cn("text-sm font-medium", error && "text-destructive", disabled && "opacity-50")}>
          {label}
          {is_required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="space-y-3 border border-border rounded-lg p-4">
        {DAYS.map((day) => {
          const daySchedule = schedule[day.key];
          const isEnabled = daySchedule.enabled;

          return (
            <div
              key={day.key}
              className={cn(
                "border border-border rounded-lg p-3 transition-all",
                isEnabled && "bg-accent/20"
              )}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => handleDayToggle(day.key, e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className={cn("font-medium", !isEnabled && "text-muted-foreground")}>
                    {day.label}
                  </span>
                </div>
                {isEnabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToAll(day.key)}
                    disabled={disabled}
                    className="h-7 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy to all
                  </Button>
                )}
              </div>

              {/* Time Slots */}
              {isEnabled && (
                <div className="space-y-2 ml-7">
                  {daySchedule.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          handleTimeChange(day.key, slotIndex, "start", e.target.value)
                        }
                        disabled={disabled}
                        className="px-3 py-1.5 border border-input rounded text-sm"
                      />
                      <span className="text-muted-foreground">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          handleTimeChange(day.key, slotIndex, "end", e.target.value)
                        }
                        disabled={disabled}
                        className="px-3 py-1.5 border border-input rounded text-sm"
                      />
                      {allowMultipleSlots && daySchedule.slots.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSlot(day.key, slotIndex)}
                          disabled={disabled}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {allowMultipleSlots && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSlot(day.key)}
                      disabled={disabled}
                      className="w-full border-dashed text-xs h-8 mt-2"
                    >
                      + Add time slot
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(helperText || error) && (
        <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default function WeekTimingInput({ name, ...props }) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState: { error } }) => (
          <WeekTimingInputBase
            {...field}
            error={error?.message || props.error}
            {...props}
          />
        )}
      />
    );
  }

  return <WeekTimingInputBase {...props} />;
}
