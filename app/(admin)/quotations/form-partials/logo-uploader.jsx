"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Upload, X, Edit2 } from "lucide-react";

export default function LogoUploader({ value, onChange, className = "" }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange?.(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (value) {
    return (
      <div className={`relative group ${className}`}>
        <div className="w-32 h-32 border border-border rounded-lg overflow-hidden bg-white flex items-center justify-center p-2">
          <img
            src={value}
            alt="Company Logo"
            className="object-contain max-w-full max-h-full"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Change
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="text-xs text-destructive hover:text-destructive"
          >
            <X className="w-3 h-3 mr-1" />
            Remove
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground font-medium">Upload Logo</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
