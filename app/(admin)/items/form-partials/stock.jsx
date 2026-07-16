"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { NumberInput, SelectInput, RadioInput, SwitchInput } from "@/components/form";
import { Section, ToggleAddLink } from "./FormHelpers";
import { WAREHOUSE_OPTIONS, TRACKING_METHOD_OPTIONS } from "./formConstants";

/* ------------------------------------------------------------------ */
/* 4. Stock Management                                                 */
/* ------------------------------------------------------------------ */

export default function Stock() {
  const { control } = useFormContext();
  const warehouseStockArray = useFieldArray({ control, name: "warehouseStock" });

  return (
    <div className="space-y-4">
      <div>
        <SwitchInput
          name="strictControl"
          label="Strict Control"
          helperText="Prevent this item from going out of stock and restrict transactions if stock goes below zero."
        />
      </div>
      <div>
        <NumberInput
          name="initialStock"
          label="Initial Stock"
          helperText="The stock available for sale at the beginning of accounting period"
        />
      </div>
      <div>
        <RadioInput
          name="trackingMethod"
          label="Tracking Method"
          orientation="horizontal"
          options={TRACKING_METHOD_OPTIONS}
        />
      </div>
      <div className="flex flex-col gap-3">
        {warehouseStockArray.fields.map((f, index) => (
          <div key={f.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <SelectInput
              name={`warehouseStock.${index}.warehouse`}
              label={index === 0 ? "Warehouse" : undefined}
              is_required={index === 0}
              placeholder="Select a Warehouse"
              options={WAREHOUSE_OPTIONS}
            />
            <NumberInput name={`warehouseStock.${index}.stock`} label={index === 0 ? "Initial Stock" : undefined} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={warehouseStockArray.fields.length === 1}
              onClick={() => warehouseStockArray.remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <div>
          <ToggleAddLink
            label="Add Warehouse"
            active={false}
            onClick={() => warehouseStockArray.append({ warehouse: "", stock: "0" })}
          />
        </div>
      </div>
    </div>
  );
}
