"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { CheckboxInput, TextareaInput } from "@/components/form";

export default function ShippingDetails() {
  const { control } = useFormContext();
  const shipping_enabled = useWatch({ control, name: "shipping_enabled" });

  return (
    <Card>
      <CardContent>
        <CheckboxInput name="shipping_enabled" label="Add Shipping Details" helperText="Ship to a different address than the client's billing address" />
        {shipping_enabled && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            <TextareaInput name="shipping_address" label="Shipping Address" rows={6} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
