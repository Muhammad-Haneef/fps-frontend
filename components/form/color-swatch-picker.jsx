"use client";

import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon, Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample color swatches
const DEFAULT_COLORS = [
  { label: "#FF5733", value: "#FF5733", name: "Coral Red" },
  { label: "#33FF57", value: "#33FF57", name: "Lime Green" },
  { label: "#3357FF", value: "#3357FF", name: "Royal Blue" },
  { label: "#FF33A1", value: "#FF33A1", name: "Hot Pink" },
  { label: "#FFD700", value: "#FFD700", name: "Gold" },
  { label: "#00CED1", value: "#00CED1", name: "Dark Turquoise" },
  { label: "#FF4500", value: "#FF4500", name: "Orange Red" },
  { label: "#8A2BE2", value: "#8A2BE2", name: "Blue Violet" },
  { label: "#00FF7F", value: "#00FF7F", name: "Spring Green" },
  { label: "#DC143C", value: "#DC143C", name: "Crimson" },
  { label: "#00BFFF", value: "#00BFFF", name: "Deep Sky Blue" },
  { label: "#FF1493", value: "#FF1493", name: "Deep Pink" },
  { label: "#32CD32", value: "#32CD32", name: "Lime Green" },
  { label: "#FF6347", value: "#FF6347", name: "Tomato" },
  { label: "#4B0082", value: "#4B0082", name: "Indigo" },
  { label: "#FF8C00", value: "#FF8C00", name: "Dark Orange" },
  { label: "#9370DB", value: "#9370DB", name: "Medium Purple" },
  { label: "#20B2AA", value: "#20B2AA", name: "Light Sea Green" },
  { label: "#DB7093", value: "#DB7093", name: "Pale Violet Red" },
  { label: "#F0E68C", value: "#F0E68C", name: "Khaki" },
];

export default function ColorSwatchPicker({
  name,
  label,
  placeholder = "Select a color",
  is_required = false,
  helperText,
  tooltip,
  disabled = false,
  className = "",
  colors = DEFAULT_COLORS,
  allowClear = true,
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || "";
  const error = errors[name]?.message;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedColor = colors.find((c) => c.value === value);

  const filteredColors = colors.filter(
    (color) =>
      color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      color.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (color) => {
    setValue(name, color.value, { shouldValidate: true });
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={name} className={error ? "text-destructive" : ""}>
            {label}
            {is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={`relative flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
              error ? "border-destructive" : "border-input"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {value ? (
              <>
                <div
                  className="w-5 h-5 rounded border border-border"
                  style={{ backgroundColor: value }}
                />
                <span className="flex-1 text-sm">
                  {selectedColor?.name || value}
                </span>
                {allowClear && !disabled && (
                  <button
                    onClick={handleClear}
                    className="hover:text-destructive"
                  >
                    <Cross2Icon className="h-4 w-4" />
                  </button>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="p-3">
              {filteredColors.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No colors found
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {filteredColors.map((color, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleSelect(color)}
                            className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                              value === color.value
                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                : "border-border"
                            }`}
                            style={{ backgroundColor: color.value }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-semibold">{color.name}</p>
                            <p className="text-muted-foreground">{color.value}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
