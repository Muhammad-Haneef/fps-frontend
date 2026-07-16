"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { NumberInput, SelectInput } from "@/components/form";
import { Section, ToggleAddLink } from "./FormHelpers";
import { WAREHOUSE_OPTIONS } from "./formConstants";

/* ------------------------------------------------------------------ */
/* 5. Reorder & Overstock                                              */
/* ------------------------------------------------------------------ */

export default function ReorderOverstock() {
  const { control } = useFormContext();
  const warehouseReorderArray = useFieldArray({ control, name: "warehouseReorder" });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Item Level Stock</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput name="reordering_point" label="Reordering Point" />
          <NumberInput name="overstock_point" label="Overstock Point" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold">Warehouse Level</span>
        {warehouseReorderArray.fields.map((f, index) => (
          <div key={f.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
            <SelectInput
              name={`warehouseReorder.${index}.warehouse_id`}
              label={index === 0 ? "Warehouse" : undefined}
              placeholder="Select a Warehouse"
              options={WAREHOUSE_OPTIONS}
            />
            <NumberInput
              name={`warehouseReorder.${index}.reordering_point`}
              label={index === 0 ? "Reordering Point" : undefined}
            />
            <NumberInput
              name={`warehouseReorder.${index}.overstock_point`}
              label={index === 0 ? "Overstock Point" : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={warehouseReorderArray.fields.length === 1}
              onClick={() => warehouseReorderArray.remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <div>
          <ToggleAddLink
            label="Add Warehouse"
            active={false}
            onClick={() =>
              warehouseReorderArray.append({ warehouse_id: "", reordering_point: "2", overstock_point: "5" })
            }
          />
        </div>
      </div>
    </div>
  );
}
