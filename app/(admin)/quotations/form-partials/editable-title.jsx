"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

export default function EditableTitle({ 
  value, 
  onChange, 
  placeholder = "Click to edit",
  className = "",
  editIconClassName = "" 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange?.(localValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(value || "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`border-0 border-b-2 border-primary outline-none bg-transparent text-center px-2 ${className}`}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`group cursor-pointer flex items-center justify-center gap-2 hover:text-primary transition-colors ${className}`}
    >
      <span>{value || placeholder}</span>
      <Pencil className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${editIconClassName}`} />
    </div>
  );
}
