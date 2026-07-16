"use client";

import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon, ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
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

export default function CategoryTreeSelect({
  name,
  label,
  placeholder = "Select a category",
  is_required = false,
  helperText,
  tooltip,
  disabled = false,
  className = "",
  categories = [], // Hierarchical category tree
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || "";
  const error = errors[name]?.message;

  const [isOpen, setIsOpen] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigate through category tree based on breadcrumb
  const currentOptions = breadcrumb.reduce((acc, cur) => {
    const found = acc?.find((item) => item.label === cur);
    return found?.children || [];
  }, categories);

  // Display either current level or search results
  const displayOptions = searchQuery
    ? categories.filter((cat) =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentOptions;

  const handleSelect = (category) => {
    const selectedPath = [...breadcrumb, category.label];
    
    if (!category.children || category.children.length === 0) {
      // Leaf category - select it
      const fullPath = selectedPath.join(" > ");
      setValue(name, fullPath, { shouldValidate: true });
      setIsOpen(false);
      setBreadcrumb([]);
      setSearchQuery("");
    } else {
      // Has children - navigate deeper
      setBreadcrumb(selectedPath);
    }
  };

  const handleBreadcrumbClick = (index) => {
    setBreadcrumb(breadcrumb.slice(0, index));
  };

  const handleReset = () => {
    setBreadcrumb([]);
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

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div>
            <Input
              value={value || ""}
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              className={`cursor-pointer ${error ? "border-destructive" : ""}`}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-3 border-b">
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>

          {/* Breadcrumb Navigation */}
          {breadcrumb.length > 0 && !searchQuery && (
            <div className="flex items-center gap-1 px-3 py-2 text-xs text-muted-foreground border-b bg-muted/50">
              <button
                onClick={handleReset}
                className="hover:text-foreground font-medium"
              >
                Home
              </button>
              {breadcrumb.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1">
                  <ChevronRightIcon className="h-3 w-3" />
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="hover:text-foreground font-medium"
                  >
                    {crumb}
                  </button>
                </div>
              ))}
            </div>
          )}

          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {displayOptions.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No categories found
                </div>
              ) : (
                <div className="space-y-1">
                  {displayOptions.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(category)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
                    >
                      <span>{category.label}</span>
                      {category.children && category.children.length > 0 && (
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
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
