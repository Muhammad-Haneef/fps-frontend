"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  GripVertical, Copy, Trash2, ChevronDown, ChevronUp,
  FileImage, AlignLeft, Upload, X
} from "lucide-react";
import { TextInput, NumberInput, SelectInput, RichTextEditor } from "@/components/form";
import { calculateItemTotal, formatCurrency } from "./utils";

import { useUnitsStore } from "@/stores/meta-data/useUnitsStore";


const discountTypeOptions = [
  { label: "%", value: "percentage" },
  { label: "Fixed", value: "fixed" }
];

export default function QuotationItemRow({
  itemIndex,
  onRemove,
  onDuplicate,
  isFirst = false
}) {
  const { watch, setValue } = useFormContext();
  const [showDescription, setShowDescription] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const item = watch(`items.${itemIndex}`);
  const currency = watch("currency") || "PKR";


  const getUnits = useUnitsStore((s) => s.getForDropdown);
  const units = useUnitsStore((s) => s.forDropdown);
  const unitsLoading = useUnitsStore((s) => s.loading);

  useEffect(() => {
    getUnits();
  }, [getUnits]);


  // Calculate totals
  const totals = calculateItemTotal({
    quantity: item?.quantity || 0,
    rate: item?.rate || 0,
    discountType: item?.discountType || "percentage",
    discountValue: item?.discountValue || 0,
    taxRate: item?.taxRate || 0
  });

  // Auto-update calculated fields
  React.useEffect(() => {
    setValue(`items.${itemIndex}.subtotal`, totals.amountAfterDiscount);
    setValue(`items.${itemIndex}.taxAmount`, totals.taxAmount);
    setValue(`items.${itemIndex}.total`, totals.total);
  }, [totals, itemIndex, setValue]);

  if (isCollapsed) {
    return (
      <div className="bg-muted/50 p-3 rounded-lg border border-border flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="h-8 w-8"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <span className="font-medium">{item?.name || "Untitled Item"}</span>
          <span className="text-sm text-muted-foreground">
            {item?.quantity || 0} × {formatCurrency(item?.rate || 0, currency)}
          </span>
        </div>
        <span className="font-semibold">{formatCurrency(totals.total, currency)}</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow">
      {/* Row Header with Drag Handle */}
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground mt-2"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Main Fields Grid */}
        <div className="flex-1 grid grid-cols-12 gap-3">
          {/* Item Name - Col Span 4 */}
          <div className="col-span-12 md:col-span-4">
            <TextInput
              name={`items.${itemIndex}.name`}
              placeholder="Item name"
              label={isFirst ? "Item Name" : ""}
            />
          </div>

          {/* SKU - Col Span 2 */}
          <div className="col-span-6 md:col-span-2">
            <TextInput
              name={`items.${itemIndex}.sku`}
              placeholder="SKU"
              label={isFirst ? "SKU" : ""}
            />
          </div>

          {/* Unit - Col Span 2 */}
          <div className="col-span-6 md:col-span-2">
            <SelectInput
              name={`items.${itemIndex}.unit`}
              placeholder="Unit"
              options={units}
              label={isFirst ? "Unit" : ""}
              loading={unitsLoading}
            />
          </div>

          {/* Quantity - Col Span 1 */}
          <div className="col-span-4 md:col-span-1">
            <NumberInput
              name={`items.${itemIndex}.quantity`}
              placeholder="Qty"
              min={1}
              allowDecimal={false}
              label={isFirst ? "Qty" : ""}
            />
          </div>

          {/* Rate - Col Span 2 */}
          <div className="col-span-4 md:col-span-2">
            <NumberInput
              name={`items.${itemIndex}.rate`}
              placeholder="Rate"
              min={0}
              allowDecimal={true}
              label={isFirst ? "Rate" : ""}
            />
          </div>

          {/* Amount - Col Span 1 */}
          <div className="col-span-4 md:col-span-1">
            <NumberInput
              value={totals.lineAmount}
              disabled={true}
              label={isFirst ? "Amount" : ""}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-8 w-8"
          >
            <ChevronUp className="w-4 h-4" />
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

      {/* Discount and Tax Row */}
      <div className="grid grid-cols-12 gap-3 pl-7">
        {/* Discount Type */}
        <div className="col-span-6 md:col-span-2">
          <SelectInput
            name={`items.${itemIndex}.discountType`}
            placeholder="Type"
            options={discountTypeOptions}
            label="Discount Type"
          />
        </div>

        {/* Discount Value */}
        <div className="col-span-6 md:col-span-2">
          <NumberInput
            name={`items.${itemIndex}.discountValue`}
            placeholder="0"
            min={0}
            allowDecimal={true}
            label="Discount Value"
          />
        </div>

        {/* Tax Rate */}
        <div className="col-span-6 md:col-span-2">
          <NumberInput
            name={`items.${itemIndex}.taxRate`}
            placeholder="Tax %"
            min={0}
            max={100}
            allowDecimal={true}
            label="Tax Rate %"
          />
        </div>

        {/* Tax Amount */}
        <div className="col-span-6 md:col-span-2">
          <NumberInput
            value={totals.taxAmount}
            disabled={true}
            label="Tax Amount"
          />
        </div>

        {/* Total */}
        <div className="col-span-12 md:col-span-2">
          <NumberInput
            value={totals.total}
            disabled={true}
            label="Total"
            className="font-semibold"
          />
        </div>
      </div>

      {/* Toggle Buttons for Description & Image */}
      <div className="flex gap-2 pl-7">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowDescription(!showDescription)}
          className="text-xs"
        >
          <AlignLeft className="w-3 h-3 mr-1" />
          {showDescription ? "Hide" : "Add"} Description
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowImage(!showImage)}
          className="text-xs"
        >
          <FileImage className="w-3 h-3 mr-1" />
          {showImage ? "Hide" : "Add"} Image
        </Button>
      </div>

      {/* Description Editor */}
      {showDescription && (
        <div className="pl-7 animate-in slide-in-from-top-2 duration-200">
          <RichTextEditor
            name={`items.${itemIndex}.description`}
            placeholder="Enter detailed item description..."
            height={150}
          />
        </div>
      )}

      {/* Image Upload */}
      {showImage && (
        <div className="pl-7 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Item Image</label>
            <div
              onClick={() => document.getElementById(`item-image-${itemIndex}`)?.click()}
              className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-muted/30 transition-colors"
            >
              {item?.image ? (
                <div className="relative">
                  <img
                    src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)}
                    alt="Item"
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue(`items.${itemIndex}.image`, null);
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
              id={`item-image-${itemIndex}`}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setValue(`items.${itemIndex}.image`, reader.result);
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

      {/* Calculated Summary for this row */}
      <div className="pl-7 pt-2 border-t border-border text-xs text-muted-foreground flex justify-between">
        <div className="space-x-4">
          <span>Line: {formatCurrency(totals.lineAmount, currency)}</span>
          {totals.discountAmount > 0 && (
            <span>Discount: -{formatCurrency(totals.discountAmount, currency)}</span>
          )}
          <span>After Discount: {formatCurrency(totals.amountAfterDiscount, currency)}</span>
          {totals.taxAmount > 0 && (
            <span>Tax: +{formatCurrency(totals.taxAmount, currency)}</span>
          )}
        </div>
        <span className="font-semibold text-foreground">
          Row Total: {formatCurrency(totals.total, currency)}
        </span>
      </div>
    </div>
  );
}
