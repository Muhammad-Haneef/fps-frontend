"use client";

import { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  TextInput,
  NumberInput,
  SelectInput,
  CheckboxInput,
  RadioInput,
  TextareaInput,
  TagInput,
  MultiImageUpload,
  ImageUpload,
  MultiSelectInput,
} from "@/components/form";

import { ToggleAddLink } from "./FormHelpers";
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "./formConstants";

import DropDownByStore from "@/components/lookups/dropdown-by-store";
import Categories from "@/components/lookups/categories";

import { useTagStore } from "@/stores/useTagStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useUnitsStore } from "@/stores/meta-data/useUnitsStore";

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

  const custom_fieldsArray = useFieldArray({ control, name: "custom_fields" });

  const getVendors = useCompanyStore((s) => s.getForDropdown);
  const vendors = useCompanyStore((s) => s.forDropdown);
  const vendorsLoading = useCompanyStore((s) => s.loading);

  const getTags = useTagStore((s) => s.getForDropdown);
  const tags = useTagStore((s) => s.forDropdown);
  const tagsLoading = useTagStore((s) => s.loading);

  const getUnits = useUnitsStore((s) => s.getForDropdown);
  const units = useUnitsStore((s) => s.forDropdown);
  const unitsLoading = useUnitsStore((s) => s.loading);

  useEffect(() => {
    getVendors();
    getTags();
    getUnits();
  }, [getVendors, getTags, getUnits]);

  return (
    <div className="space-y-5">


      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          <TextInput
            name="title"
            label="Item Name"
            is_required
            placeholder="Enter name of your item"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-2">
          <TextInput
            name="sku"
            label="SKU"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-2">
          <SelectInput
            name="qty_unit_id"
            label="Product Qty Unit"
            placeholder="Select a Product Qty Unit"
            options={units}
            isLoading={unitsLoading}
          />
        </div>

        <div className="col-span-12">
          <Categories />
        </div>
      </div>


      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <RadioInput
            name="product_type"
            label="Item Type"
            orientation="horizontal"
            options={[
              { label: "Product", value: "product" },
              { label: "Service", value: "service" },
            ]}
          />
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <CheckboxInput
            name="saleable"
            label="This item can be sold to customers"
            helperText="Enable this for items that can be sold to external customers or clients."
          />
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <CheckboxInput
            name="manage_stock"
            label="Manage Stock"
            helperText="Track inventory levels for this item"
          />
        </div>
      </div>

      <div>
        <ImageUpload name="thumbnail" label="Item Image" />
        <MultiImageUpload
          name="images"
          label="Item Images"
          maxImages={6}
          gridCols={4}
          className="max-w-xs"
        />
      </div>


      {showDescription && (
        <TextareaInput name="description" label="Description" placeholder="Write a short description..." rows={3} />
      )}

      {showVendor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MultiSelectInput name="registered_verdors" label="Select Registered Vendors" placeholder="Select vendor" loading={vendorsLoading} options={vendors?.filter((item) => item.type_id === 1) ?? []} />
          <MultiSelectInput name="prefered_verdors" label="Select Prefered Vendors" placeholder="Select vendor" loading={vendorsLoading} options={vendors?.filter((item) => item.type_id === 2) ?? []} />
        </div>
      )}

      {showTags && <MultiSelectInput name="tag_ids" label="Tags" labelKey="title" valueKey="id" loading={tagsLoading} options={tags} />}

      {showDimensions && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <NumberInput name="length" label="Length" allowDecimal />
          <NumberInput name="width" label="Width" allowDecimal />
          <NumberInput name="height" label="Height" allowDecimal />
          <SelectInput name="dimension_unit_id" label="Dimensions Unit" placeholder="Select a Dimensions Unit" options={units} isLoading={unitsLoading} />
        </div>
      )}

      {showWeights && (
        <div className="col-span-12 sm:col-span-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <NumberInput
              name="gross_weight"
              label="Gross Weight"
              allowDecimal
            />

            <NumberInput
              name="net_weight"
              label="Net Weight"
              allowDecimal
            />

            <SelectInput
              name="weight_unit_id"
              label="Weight Unit"
              placeholder="Select a Weight Unit"
              options={units}
              isLoading={unitsLoading}
            />
          </div>
        </div>
      )}

      {custom_fieldsArray.fields.map((f, index) => (
        <div key={f.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 items-end">
          <TextInput name={`custom_fields.${index}.key`} label="Field Name" placeholder="e.g. Fabric Type" />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <TextInput name={`custom_fields.${index}.value`} label="Field Value" placeholder="e.g. Cotton" />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => custom_fieldsArray.remove(index)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}

      {/* Expandable extra fields */}
      <div className="flex flex-wrap gap-4 pt-1">
        <ToggleAddLink label="Add Description" active={showDescription} onClick={() => setShowDescription((s) => !s)} />
        <ToggleAddLink label="Add Tags" active={showTags} onClick={() => setShowTags((s) => !s)} />
        <ToggleAddLink label="Add Vendor Details" active={showVendor} onClick={() => setShowVendor((s) => !s)} />
        <ToggleAddLink label="Add Dimensions" active={showDimensions} onClick={() => setShowDimensions((s) => !s)} />
        <ToggleAddLink label="Add Weights" active={showWeights} onClick={() => setShowWeights((s) => !s)} />

        {/*
        <ToggleAddLink
          label="Add Custom Fields"
          active={custom_fieldsArray.fields.length > 0}
          onClick={() => custom_fieldsArray.append({ key: "", value: "" })}
        />
        */}

      </div>
    </div>
  );
}
