"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SelectInput } from "@/components/form";
import { CURRENCY_OPTIONS, NUMBER_FORMAT_OPTIONS } from "./calculations";

export default function CurrencySelector() {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-6">
        <div className="w-64">
          <SelectInput name="currency_id" label="Currency" is_required options={CURRENCY_OPTIONS} placeholder="Select currency" />
        </div>
        <div className="w-56">
          <SelectInput name="number_format" label="Number Format" options={NUMBER_FORMAT_OPTIONS} placeholder="Select format" />
        </div>
      </CardContent>
    </Card>
  );
}
