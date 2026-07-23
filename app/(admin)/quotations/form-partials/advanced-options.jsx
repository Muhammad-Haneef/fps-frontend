"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxInput } from "@/components/form";

const OPTIONS = [
  { name: "advanced_options.display_unit", label: "Display unit for each item" },
  { name: "advanced_options.merge_quantity", label: "Merge unit with quantity" },
  { name: "advanced_options.show_tax_summary", label: "Show tax summary in quotation" },
  { name: "advanced_options.hide_country", label: "Hide place / country of supply" },
  { name: "advanced_options.hide_original_images", label: "Hide original images in line items" },
  { name: "advanced_options.show_thumbnails", label: "Show thumbnails in separate column" },
  { name: "advanced_options.show_full_description", label: "Show description in full width" },
  { name: "advanced_options.hide_group_subtotal", label: "Hide subtotal for group items" },
  { name: "advanced_options.show_sku", label: "Show SKU in quotation" },
  { name: "advanced_options.show_serial_number", label: "Show serial numbers in quotation" },
  { name: "advanced_options.display_batch_details", label: "Display batch details in columns" },
  { name: "advanced_options.show_item_images", label: "Show item images in quotation" },
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
