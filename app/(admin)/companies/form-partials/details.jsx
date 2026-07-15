"use client";

import { use, useEffect } from "react";

import TextInput from "@/components/form/text-input";
import TextareaInput from "@/components/form/textarea-input";
import DropDownByStore from "@/components/lookups/dropdown-by-store";
import { BooleanField } from "@/components/lookups/common-fields";

import { useOwnershipsStore } from "@/stores/meta-data/useOwnershipsStore";
import { useCompanySizesStore } from "@/stores/meta-data/useCompanySizesStore";
import { useSourceTypesStore } from "@/stores/meta-data/useSourceTypesStore";

export default function Details() {
  /*
    useOwnershipsStore
useCompanySizesStore
useSourceTypesStore
    */

  return (
    <div className="space-y-6">
      {/* Description & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextareaInput label="Description" name="description" />
        <TextareaInput label="Notes" name="notes" />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <DropDownByStore
          name="ownership_id"
          label="Company Ownership"
          useStore={useOwnershipsStore}
        />

        <DropDownByStore
          name="company_size_id"
          label="Company Size"
          useStore={useCompanySizesStore}
        />

        <DropDownByStore
          name="source_id"
          label="Source"
          useStore={useSourceTypesStore}
        />
      </div>

      {/* Other Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <TextInput label="Annual Revenue" name="annual_revenue" />

        <TextInput type="number" label="Sort Order" name="sort_by" />

        <BooleanField label="Is Active" name="is_active" />
      </div>
    </div>
  );
}
