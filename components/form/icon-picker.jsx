"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { InfoCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample icon list - replace with your actual icons
const SAMPLE_ICONS = [
  "home", "user", "settings", "search", "heart", "star", "mail", "bell",
  "calendar", "camera", "clock", "cloud", "download", "edit", "file",
  "folder", "gift", "image", "link", "lock", "map", "message", "phone",
  "play", "plus", "refresh", "save", "share", "shopping-cart", "trash",
  "upload", "video", "volume", "wifi", "zoom-in", "zoom-out", "arrow-left",
  "arrow-right", "arrow-up", "arrow-down", "check", "close", "menu",
  "more-vertical", "more-horizontal", "info", "warning", "error", "success",
];

export default function IconPicker({
  name,
  label,
  placeholder = "Select an icon",
  is_required = false,
  helperText,
  tooltip,
  disabled = false,
  className = "",
  icons = SAMPLE_ICONS, // Custom icon list
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || "";
  const error = errors[name]?.message;

  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(value);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = icons.filter((icon) =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    setValue(name, tempSelected, { shouldValidate: true });
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCancel = () => {
    setTempSelected(value);
    setIsOpen(false);
    setSearchQuery("");
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

      <div
        onClick={() => !disabled && setIsOpen(true)}
        className={`cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <Input
          value={value || ""}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          className={error ? "border-destructive" : ""}
        />
      </div>

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select an Icon</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 h-[60vh]">
            {/* Left: Icon Grid */}
            <div className="flex-1 flex flex-col">
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="flex-1 border rounded-md p-4">
                <div className="grid grid-cols-8 gap-3">
                  {filteredIcons.map((icon) => (
                    <div
                      key={icon}
                      onClick={() => setTempSelected(icon)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                        tempSelected === icon
                          ? "bg-primary/10 border-2 border-primary"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {/* Replace with actual icon component */}
                        <span className="text-2xl">📦</span>
                      </div>
                      <span className="text-[10px] text-center break-all line-clamp-2">
                        {icon}
                      </span>
                    </div>
                  ))}
                </div>

                {filteredIcons.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No icons found
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Right: Preview */}
            <div className="w-64 flex flex-col items-center justify-center border rounded-md p-6 bg-muted/50">
              <h4 className="text-sm font-semibold mb-6">Preview</h4>
              {tempSelected ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 flex items-center justify-center text-6xl">
                    {/* Replace with actual icon component */}
                    <span>📦</span>
                  </div>
                  <p className="text-sm text-center break-all font-mono">
                    {tempSelected}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No icon selected
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!tempSelected}>
              Select Icon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
