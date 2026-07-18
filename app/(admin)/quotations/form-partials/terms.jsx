"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInput } from "@/components/form";
import { makeTerm } from "./calculations";

export default function Terms() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "terms" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {fields.map((field, i) => (
          <div key={field.id} className="flex items-start gap-3">
            <span className="text-sm font-bold text-muted-foreground mt-2 w-6 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <TextInput name={`terms.${i}.text`} label="" placeholder="Enter a term" />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-2 text-muted-foreground hover:text-destructive"
              aria-label="Remove term"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append(makeTerm())}
          className="self-start mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="w-4 h-4" /> Add New Term
        </button>
      </CardContent>
    </Card>
  );
}
