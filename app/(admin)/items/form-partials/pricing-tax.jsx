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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput name="currency" label="Currency" options={CURRENCY_OPTIONS} searchable={false} />
        <CurrencyFormatControl name="currencyFormat" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          name="buyingPrice"
          label="Buying Price"
          helperText="Rate at which you purchased this item"
          allowDecimal
        />
        <NumberInput
          name="sellingPrice"
          label="Selling Price"
          helperText="Rate at which you are going to sell this item"
          allowDecimal
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          name="landedCost"
          label="Landed Cost"
          helperText="Cost per unit incurred in addition to purchase price"
          placeholder="Transport, delivery, handling etc"
        />
        <NumberInput name="taxRate" label="Tax Rate(in %)" allowDecimal min={0} max={100} />
      </div>
      <div>
        <CheckboxInput name="priceInclusiveOfTaxes" label="Price is inclusive of taxes" />
      </div>
    </div>
  );
}
