"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import {
  TextInput,
  NumberInput,
  SelectInput,
  CheckboxInput,
  RadioInput,
  TextareaInput,
  TagInput,
  MultiImageUpload,
} from "@/components/form";

import { Section, ToggleAddLink } from "./FormHelpers";
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "./formConstants";

/* ------------------------------------------------------------------ */
/* 1. Item / Product Details                                           */
/* ------------------------------------------------------------------ */

export default function Details() {
  const { control } = useFormContext();

  const [showDescription, setShowDescription] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showVendor, setShowVendor] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [showWeights, setShowWeights] = useState(false);

  const customFieldsArray = useFieldArray({ control, name: "customFields" });

  return (
    <div className="space-y-4">
      <div>

        <RadioInput
          name="itemType"
          label="Item Type"
          orientation="horizontal"
          options={[
            { label: "Product", value: "product" },
            { label: "Service", value: "service" },
          ]}
        />
      </div>
      <div>

        <SelectInput
          name="category"
          label="Category"
          placeholder="Select a Category"
          options={CATEGORY_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxInput
          name="sellableToCustomers"
          label="This item can be sold to customers"
          helperText="Enable this for items that can be sold to external customers or clients."
        />
        <CheckboxInput
          name="manageStock"
          label="Manage Stock"
          helperText="Track inventory levels for this item"
        />
      </div>

      <div>
        <MultiImageUpload name="itemImages" label="Item Images" maxImages={6} gridCols={4} />

        <MultiImageUpload
          name="itemOriginalImages"
          label="Item Original Images"
          maxImages={6}
          gridCols={4}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput name="itemName" label="Item Name" is_required placeholder="Enter name of your item" />
        <TextInput name="skuId" label="SKU ID" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput name="unit" label="Unit" placeholder="Select a quantity unit" options={UNIT_OPTIONS} />
      </div>

      {/* Expandable extra fields */}
      <div className="flex flex-wrap gap-4 pt-1">
        <ToggleAddLink label="Add Description" active={showDescription} onClick={() => setShowDescription((s) => !s)} />
        <ToggleAddLink label="Add Tags" active={showTags} onClick={() => setShowTags((s) => !s)} />
        <ToggleAddLink label="Add Vendor Details" active={showVendor} onClick={() => setShowVendor((s) => !s)} />
        <ToggleAddLink label="Add Dimensions" active={showDimensions} onClick={() => setShowDimensions((s) => !s)} />
        <ToggleAddLink label="Add Weights" active={showWeights} onClick={() => setShowWeights((s) => !s)} />
      </div>

      {showDescription && (
        <TextareaInput name="description" label="Description" placeholder="Write a short description..." rows={3} />
      )}

      {showTags && <TagInput name="tags" label="Tags" placeholder="Type and press Enter to add tag..." />}

      {showVendor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput name="vendorName" label="Vendor Name" placeholder="e.g. Al-Karam Textiles" />
          <TextInput name="vendorCode" label="Vendor Code" placeholder="e.g. VEN-0042" />
        </div>
      )}

      {showDimensions && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput name="dimLength" label="Length" allowDecimal dropdownOptions={["cm", "in"]} dropdownValue="cm" />
          <NumberInput name="dimWidth" label="Width" allowDecimal dropdownOptions={["cm", "in"]} dropdownValue="cm" />
          <NumberInput name="dimHeight" label="Height" allowDecimal dropdownOptions={["cm", "in"]} dropdownValue="cm" />
        </div>
      )}

      {showWeights && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput name="weightValue" label="Weight" allowDecimal dropdownOptions={["kg", "lb"]} dropdownValue="kg" />
        </div>
      )}

      <div className="pt-1">
        <ToggleAddLink
          label="Add Custom Fields"
          active={customFieldsArray.fields.length > 0}
          onClick={() => customFieldsArray.append({ key: "", value: "" })}
        />
        {customFieldsArray.fields.map((f, index) => (
          <div key={f.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 items-end">
            <TextInput name={`customFields.${index}.key`} label="Field Name" placeholder="e.g. Fabric Type" />
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <TextInput name={`customFields.${index}.value`} label="Field Value" placeholder="e.g. Cotton" />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => customFieldsArray.remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
