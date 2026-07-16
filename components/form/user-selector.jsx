"use client";

import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InfoCircledIcon, MagnifyingGlassIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample users
const SAMPLE_USERS = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    profile_image: null,
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    profile_image: null,
  },
  {
    id: 3,
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob@example.com",
    profile_image: null,
  },
];

export default function UserSelector({
  name,
  label,
  placeholder = "Select a user",
  is_required = false,
  helperText,
  tooltip,
  disabled = false,
  className = "",
  users = SAMPLE_USERS,
  onSearch, // Async search handler
  loading = false,
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || null;
  const error = errors[name]?.message;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(users);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);

  // Find selected user
  const selectedUser = value
    ? users.find((u) => u.id === value || u.id === value?.id)
    : null;

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchTerm.trim()) {
      setSearchResults(users);
      setIsSearching(false);
      return;
    }

    if (onSearch) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await onSearch(searchTerm);
          setSearchResults(results || []);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      const filtered = users.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, users, onSearch]);

  const handleSelect = (user) => {
    setValue(name, user.id, { shouldValidate: true });
    setIsOpen(false);
    setSearchTerm("");
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
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
        className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
          error ? "border-destructive" : "border-input"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {selectedUser ? (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.profile_image} />
              <AvatarFallback>
                {getInitials(selectedUser.first_name, selectedUser.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {selectedUser.first_name} {selectedUser.last_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedUser.email}
              </p>
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-10 w-10 bg-muted">
              <AvatarFallback>
                <PersonIcon className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          </>
        )}
      </div>

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{label || "Select User"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            <ScrollArea className="h-[400px] border rounded-md p-4">
              {loading || isSearching ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-md border bg-muted animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted-foreground/20 mx-auto mb-2" />
                      <div className="h-4 bg-muted-foreground/20 rounded mb-1" />
                      <div className="h-3 bg-muted-foreground/20 rounded w-3/4 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelect(user)}
                      className={`p-3 rounded-md border text-center hover:shadow-md transition-all ${
                        selectedUser?.id === user.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Avatar className="h-12 w-12 mx-auto mb-2">
                        <AvatarImage src={user.profile_image} />
                        <AvatarFallback>
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PersonIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No users found</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
