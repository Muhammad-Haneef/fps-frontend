"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, GripVertical, Copy, Trash2, Upload, X } from "lucide-react";
import { calculateGroupSubtotal, formatCurrency } from "@/lib/quotation-utils";
import { TextInput, TextareaInput } from "@/components/form";

export default function ItemGroup({ groupIndex, groupId, onRemove, onDuplicate }) {
  const { control, watch, setValue } = useFormContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const items = watch("items") || [];
  const group = items.find(item => item.id === groupId && item.type === "group");
  const currency = watch("currency") || "PKR";

  const groupSubtotal = calculateGroupSubtotal(items, groupId);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Update in form state
    const groupItem = items.find(item => item.id === groupId);
    if (groupItem) {
      const itemIndex = items.indexOf(groupItem);
      setValue(`items.${itemIndex}.collapsed`, !isCollapsed);
    }
  };

  return (
    <div className="border-2 border-primary/20 rounded-lg bg-primary/5 overflow-hidden">
      {/* Group Header */}
      <div className="bg-primary/10 p-4 flex items-center justify-between border-b border-primary/20">
        <div className="flex items-center gap-3 flex-1">
          {/* Drag Handle */}
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Group Title */}
          <div className="flex-1">
            <input
              type="text"
              value={group?.name || ""}
              onChange={(e) => {
                const itemIndex = items.findIndex(item => item.id === groupId);
                if (itemIndex >= 0) {
                  setValue(`items.${itemIndex}.name`, e.target.value);
                }
              }}
              placeholder="Group Name (e.g., Engine Repair)"
              className="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-primary/30 focus:border-primary outline-none font-semibold text-base px-2 py-1"
            />
          </div>

          {/* Group Subtotal */}
          <div className="text-sm font-semibold text-primary">
            {formatCurrency(groupSubtotal, currency)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDuplicate}
            className="h-8 w-8"
          >
            <Copy className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Group Content - Collapsible */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Group Description */}
          <div>
            <TextareaInput
              value={group?.description || ""}
              onChange={(e) => {
                const itemIndex = items.findIndex(item => item.id === groupId);
                if (itemIndex >= 0) {
                  setValue(`items.${itemIndex}.description`, e.target.value);
                }
              }}
              placeholder="Group description (optional)"
              rows={2}
              className="text-sm"
            />
          </div>

          {/* Group Image */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImage(!showImage)}
              className="text-xs"
            >
              {showImage ? "Hide" : "Add"} Group Image
            </Button>
          </div>

          {showImage && (
            <div className="border border-border rounded-lg p-3 bg-background">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Group Image</label>
                <div
                  onClick={() => document.getElementById(`group-image-${groupId}`)?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-muted/30 transition-colors"
                >
                  {group?.image ? (
                    <div className="relative">
                      <img
                        src={typeof group.image === 'string' ? group.image : URL.createObjectURL(group.image)}
                        alt="Group"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          const itemIndex = items.findIndex(item => item.id === groupId);
                          if (itemIndex >= 0) {
                            setValue(`items.${itemIndex}.image`, null);
                          }
                        }}
                        className="absolute top-1 right-1 h-6 w-6 bg-destructive/80 hover:bg-destructive text-white"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input
                  id={`group-image-${groupId}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const itemIndex = items.findIndex(item => item.id === groupId);
                        if (itemIndex >= 0) {
                          setValue(`items.${itemIndex}.image`, reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
