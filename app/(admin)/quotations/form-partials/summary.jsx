"use client";

import { useMemo, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Plus, X, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NumberInput, SelectInput, TextInput, ImageUpload } from "@/components/form";
import {
  CURRENCY_SYMBOLS,
  DISCOUNT_TYPE_OPTIONS,
  ROUND_MODE_OPTIONS,
  computeGrandTotals,
  amountToWords,
  money,
  makeCharge,
} from "./calculations";

export default function Summary() {
  const { control } = useFormContext();
  const [chargesOpen, setChargesOpen] = useState(false);

  const currency = useWatch({ control, name: "currency" }) || "PKR";
  const symbol = CURRENCY_SYMBOLS[currency] || "";

  const items = useWatch({ control, name: "items" });
  const groups = useWatch({ control, name: "groups" });
  const overall_discount_type = useWatch({ control, name: "overall_discount_type" });
  const overall_discount_value = useWatch({ control, name: "overall_discount_value" });
  const round_mode = useWatch({ control, name: "round_mode" });
  const additional_charges = useWatch({ control, name: "additional_charges" });

  const chargesArray = useFieldArray({ control, name: "additional_charges" });

  const totals = useMemo(
    () =>
      computeGrandTotals({
        items,
        groups,
        overall_discount_type,
        overall_discount_value,
        additional_charges,
        round_mode,
      }),
    [items, groups, overall_discount_type, overall_discount_value, additional_charges, round_mode]
  );

  return (
    <div className="flex flex-col gap-4 sticky top-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2 text-sm">
            <span className="text-muted-foreground uppercase text-xs font-semibold">Amount</span>
            <span className="font-bold">{money(totals.amount, symbol)}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2 text-sm">
            <span className="text-muted-foreground uppercase text-xs font-semibold">Tax</span>
            <span className="font-bold">{money(totals.tax, symbol)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 items-end">
            <SelectInput name="overall_discount_type" label="Discount" options={DISCOUNT_TYPE_OPTIONS} placeholder="Type" />
            <NumberInput
              name="overall_discount_value"
              label=""
              placeholder={overall_discount_type === "percentage" ? "0%" : "0.00"}
              min={0}
              allowDecimal
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setChargesOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
            >
              <Tag className="w-4 h-4" /> Additional Charges
            </button>
            {chargesOpen && (
              <div className="mt-2 flex flex-col gap-2">
                {chargesArray.fields.map((f, i) => (
                  <div key={f.id} className="flex items-end gap-2">
                    <div className="flex-1">
                      <TextInput name={`additional_charges.${i}.label`} label="" placeholder="e.g. Delivery" />
                    </div>
                    <div className="w-28">
                      <NumberInput name={`additional_charges.${i}.amount`} label="" placeholder="0.00" min={0} allowDecimal maxDecimals={2} />
                    </div>
                    <button type="button" onClick={() => chargesArray.remove(i)} className="text-muted-foreground hover:text-destructive mb-2" aria-label="Remove charge">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => chargesArray.append(makeCharge())}
                  className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Charge
                </button>
              </div>
            )}
          </div>

          <SelectInput name="round_mode" label="Rounding" options={ROUND_MODE_OPTIONS} placeholder="No rounding" />

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-base font-extrabold">TOTAL</span>
            <span className="text-lg font-extrabold">{money(totals.grand, symbol)}</span>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-1">Total (in words)</p>
            <p className="text-sm italic text-muted-foreground">
              {totals.grand > 0 ? amountToWords(totals.grand) : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload name="signature" label="" helperText="Upload a signature image" aspectRatio={3} />
        </CardContent>
      </Card>
       */}

    </div>
  );
}
