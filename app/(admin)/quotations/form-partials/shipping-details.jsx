"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { CheckboxInput, TextareaInput } from "@/components/form";

export default function ShippingDetails() {
  const { control } = useFormContext();
  const shippingEnabled = useWatch({ control, name: "shippingEnabled" });

  return (
    <Card>
      <CardContent>
        <CheckboxInput name="shippingEnabled" label="Add Shipping Details" helperText="Ship to a different address than the client's billing address" />
        {shippingEnabled && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            <TextareaInput name="shipping_address" label="Shipping Address" rows={6} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
