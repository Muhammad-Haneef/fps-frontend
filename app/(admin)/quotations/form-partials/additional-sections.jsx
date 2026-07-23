"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor, TextInput } from "@/components/form";
import { makeCustomField } from "./calculations";

export function AdditionalNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <RichTextEditor name="additional_notes" label="" placeholder="Write additional notes..." height={180} toolbarConfig="basic" />
      </CardContent>
    </Card>
  );
}

export function AdditionalInfo() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "additional_info" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {fields.map((field, i) => (
          <div key={field.id} className="flex items-end gap-3">
            <div className="w-48">
              <TextInput name={`additional_info.${i}.label`} label="" placeholder="Field label" />
            </div>
            <div className="flex-1">
              <TextInput name={`additional_info.${i}.value`} label="" placeholder="Enter value" />
            </div>
            <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive mb-2" aria-label="Remove field">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append(makeCustomField())}
          className="self-start inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Custom Fields
        </button>
      </CardContent>
    </Card>
  );
}
