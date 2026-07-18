"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxInput } from "@/components/form";

const OPTIONS = [
  { name: "advancedOptions.displayUnit", label: "Display unit for each item" },
  { name: "advancedOptions.mergeQuantity", label: "Merge unit with quantity" },
  { name: "advancedOptions.showTaxSummary", label: "Show tax summary in quotation" },
  { name: "advancedOptions.hideCountry", label: "Hide place / country of supply" },
  { name: "advancedOptions.hideOriginalImages", label: "Hide original images in line items" },
  { name: "advancedOptions.showThumbnails", label: "Show thumbnails in separate column" },
  { name: "advancedOptions.showFullDescription", label: "Show description in full width" },
  { name: "advancedOptions.hideGroupSubtotal", label: "Hide subtotal for group items" },
  { name: "advancedOptions.showSKU", label: "Show SKU in quotation" },
  { name: "advancedOptions.showSerialNumber", label: "Show serial numbers in quotation" },
  { name: "advancedOptions.displayBatchDetails", label: "Display batch details in columns" },
  { name: "advancedOptions.showItemImages", label: "Show item images in quotation" },
];

export default function AdvancedOptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Options</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OPTIONS.map((opt) => (
          <CheckboxInput key={opt.name} name={opt.name} label={opt.label} />
        ))}
      </CardContent>
    </Card>
  );
}
