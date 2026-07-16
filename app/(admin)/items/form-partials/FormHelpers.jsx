"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Calculator } from "lucide-react";

import SelectInput from "@/components/form/select-input";
import { DECIMAL_OPTIONS, SEPARATOR_OPTIONS, SYMBOL_POSITION_OPTIONS } from "./formConstants";

/* ------------------------------------------------------------------ */
/* Small building blocks shared across sections                        */
/* ------------------------------------------------------------------ */

export function ToggleAddLink({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
    >
      <Plus className={active ? "h-3.5 w-3.5 rotate-45 transition-transform" : "h-3.5 w-3.5 transition-transform"} />
      {label}
    </button>
  );
}

export function CurrencyFormatControl({ name }) {
  return (
    <Controller
      name={name}
      render={({ field }) => {
        const val = field.value || { decimalPlaces: "2", separator: "comma", symbolPosition: "before" };
        const update = (patch) => field.onChange({ ...val, ...patch });
        return (
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Currency Formatting
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-9 justify-center gap-2 font-normal text-sm"
                >
                  <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
                  Number and Currency Format
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 flex flex-col gap-3" align="start">
                <SelectInput
                  label="Decimal Places"
                  options={DECIMAL_OPTIONS}
                  value={val.decimalPlaces}
                  onChange={(v) => update({ decimalPlaces: v })}
                  searchable={false}
                  clearable={false}
                />
                <SelectInput
                  label="Thousands Separator"
                  options={SEPARATOR_OPTIONS}
                  value={val.separator}
                  onChange={(v) => update({ separator: v })}
                  searchable={false}
                  clearable={false}
                />
                <SelectInput
                  label="Symbol Position"
                  options={SYMBOL_POSITION_OPTIONS}
                  value={val.symbolPosition}
                  onChange={(v) => update({ symbolPosition: v })}
                  searchable={false}
                  clearable={false}
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      }}
    />
  );
}
