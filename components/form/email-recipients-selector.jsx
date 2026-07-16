"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InfoCircledIcon,
  Cross2Icon,
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper to format values
const formatValue = (text) => {
  return text
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

// Sample hierarchy structure
const DEFAULT_HIERARCHY = {
  Leads: [
    { label: "Lead", options: ["Owner", "Creator", "Owner's Manager"] },
    { label: "Users", options: "USERS" },
  ],
  Contacts: [
    { label: "Contact", options: ["Owner", "Creator", "Owner's Manager"] },
    { label: "Account", options: ["Owner", "Creator"] },
    { label: "Reporting To", options: ["Owner", "Creator"] },
    { label: "Users", options: "USERS" },
  ],
  Accounts: [
    { label: "Account", options: ["Owner", "Creator", "Owner's Manager"] },
    { label: "Parent Account", options: ["Owner", "Creator"] },
    { label: "Users", options: "USERS" },
  ],
  Deals: [
    { label: "Deal", options: ["Owner", "Creator", "Owner's Manager"] },
    { label: "Account", options: ["Owner", "Creator"] },
    { label: "Contact", options: ["Owner", "Creator"] },
    { label: "Users", options: "USERS" },
  ],
  Tasks: [
    { label: "Task", options: ["Owner", "Creator", "Owner's Manager"] },
    { label: "Contact", options: ["Owner", "Creator"] },
    { label: "Lead", options: ["Owner", "Creator"] },
    { label: "Account", options: ["Owner", "Creator"] },
    { label: "Deal", options: ["Owner", "Creator"] },
    { label: "Users", options: "USERS" },
  ],
};

// Sample users
const SAMPLE_USERS = [
  { label: "John Doe", value: "user_john_doe" },
  { label: "Jane Smith", value: "user_jane_smith" },
  { label: "Bob Johnson", value: "user_bob_johnson" },
];

export default function EmailRecipientsSelector({
  name,
  label = "Email Recipients",
  placeholder = "Choose Users, Groups, Roles etc.",
  is_required = false,
  helperText,
  tooltip,
  disabled = false,
  className = "",
  module = "Leads", // Module context for hierarchy
  users = SAMPLE_USERS,
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || [];
  const error = errors[name]?.message;

  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalEmails, setAdditionalEmails] = useState("");
  const [emailError, setEmailError] = useState("");

  const selectedValues = Array.isArray(value) ? value : [];

  // Get hierarchy based on module
  const hierarchy = useMemo(() => {
    const normalizedModule = (module || "Leads").replace(/s$/, "");
    const matcher = Object.keys(DEFAULT_HIERARCHY).find(
      (k) => k.replace(/s$/, "").toLowerCase() === normalizedModule.toLowerCase()
    );
    const mod = matcher ? matcher : "Leads";
    return DEFAULT_HIERARCHY[mod];
  }, [module]);

  // Set initial active group
  useEffect(() => {
    if (isOpen && hierarchy.length > 0) {
      if (!activeGroup || !hierarchy.find((h) => h.label === activeGroup)) {
        setActiveGroup(hierarchy[0].label);
      }
      setSearchQuery("");
    }
  }, [isOpen, hierarchy]);

  // Get active options
  const activeOptions = useMemo(() => {
    const group = hierarchy.find((g) => g.label === activeGroup);
    if (!group) return [];

    let opts = group.options;

    if (group.label === "Users" || opts === "USERS") {
      opts = users.map((u) => ({ ...u, type: "user" }));
    } else {
      opts = opts.map((o) => ({
        label: o,
        value: `${formatValue(activeGroup)}_${formatValue(o)}`,
        type: formatValue(activeGroup),
      }));
    }

    if (searchQuery) {
      opts = opts.filter((o) =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return opts;
  }, [hierarchy, activeGroup, searchQuery, users]);

  const handleSelect = (option) => {
    const isSelected = selectedValues.find((v) => v.value === option.value);
    let newValues;
    if (isSelected) {
      newValues = selectedValues.filter((v) => v.value !== option.value);
    } else {
      newValues = [...selectedValues, option];
    }
    setValue(name, newValues, { shouldValidate: true });
  };

  const handleRemove = (valToRemove) => {
    setValue(
      name,
      selectedValues.filter((v) => v.value !== valToRemove.value),
      { shouldValidate: true }
    );
  };

  const handleAddAdditionalEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = additionalEmails
      .split(/[,\s]+/)
      .map((e) => e.trim())
      .filter((e) => e);

    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setEmailError(`Invalid email(s): ${invalidEmails.join(", ")}`);
      return;
    }

    if (emails.length === 0) {
      setEmailError("Please enter at least one email.");
      return;
    }

    const newOptions = emails.map((email) => ({
      label: email,
      value: `email_${email}`,
      type: "email",
    }));

    const combined = [...selectedValues];
    newOptions.forEach((opt) => {
      if (!combined.find((v) => v.value === opt.value)) {
        combined.push(opt);
      }
    });

    setValue(name, combined, { shouldValidate: true });
    setIsModalOpen(false);
    setAdditionalEmails("");
    setEmailError("");
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
            className={`min-h-[42px] px-3 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
              error ? "border-destructive" : "border-input"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {selectedValues.length === 0 ? (
              <span className="text-sm text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((val) => (
                  <Badge
                    key={val.value}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    <span className="text-xs">
                      {val.type}: {val.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(val);
                      }}
                      className="hover:text-destructive"
                    >
                      <Cross2Icon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] p-0" align="start">
          {/* Header: Group Select & Search */}
          <div className="flex border-b">
            <div className="w-[140px] border-r p-2">
              <Select value={activeGroup} onValueChange={setActiveGroup}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hierarchy.map((g) => (
                    <SelectItem key={g.label} value={g.label}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 p-2">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8"
              />
            </div>
          </div>

          {/* Options List */}
          <ScrollArea className="h-[250px]">
            {activeOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              <div className="p-2">
                {activeOptions.map((opt) => {
                  const isSelected = selectedValues.some(
                    (v) => v.value === opt.value
                  );
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors ${
                        isSelected ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer: Add Additional */}
          <div className="border-t">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-primary/10 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add additional recipient
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Additional Emails Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Additional Recipients</DialogTitle>
            <DialogDescription>
              Enter email addresses separated by commas or spaces
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              placeholder="e.g., john@example.com, jane@example.com"
              value={additionalEmails}
              onChange={(e) => {
                setAdditionalEmails(e.target.value);
                setEmailError("");
              }}
              className={emailError ? "border-destructive" : ""}
            />
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setAdditionalEmails("");
                setEmailError("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAdditionalEmails}>Add Recipients</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
