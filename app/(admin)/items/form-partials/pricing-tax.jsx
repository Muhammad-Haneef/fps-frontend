"use client";

import { TextInput, NumberInput, SelectInput, CheckboxInput } from "@/components/form";
import { Section, CurrencyFormatControl } from "./FormHelpers";
import { CURRENCY_OPTIONS } from "./formConstants";

/* ------------------------------------------------------------------ */
/* 3. Pricing & Taxation                                               */
/* ------------------------------------------------------------------ */

export default function PricingTax() {
  return (
    <div className="space-y-4">
      {/*
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput name="currency_id" label="Currency" options={CURRENCY_OPTIONS} searchable={false} />
        <CurrencyFormatControl name="currencyFormat" />
      </div>
      */}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <NumberInput
            name="buying_price"
            label="Buying Price"
            helperText="Rate at which you purchased this item"
            allowDecimal
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <NumberInput
            name="selling_price"
            label="Selling Price"
            helperText="Rate at which you are going to sell this item"
            allowDecimal
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <TextInput
            name="landed_cost"
            label="Landed Cost"
            helperText="Cost per unit incurred in addition to purchase price"
            placeholder="Transport, delivery, handling etc"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <NumberInput
            name="tax_rate"
            label="Tax Rate (in %)"
            allowDecimal
            min={0}
            max={100}
          />
        </div>
      </div>
      <div>
        <CheckboxInput name="is_price_inclusive_tax" label="Price is inclusive of taxes" />
      </div>
    </div>
  );
}
