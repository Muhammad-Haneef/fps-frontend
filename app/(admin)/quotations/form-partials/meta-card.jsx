"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Image, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TextInput, DatePickerInput, NumberInput, AvatarUpload } from "@/components/form";
import { makeCustomField } from "./calculations";

export default function MetaCard() {
  const { control } = useFormContext();
  const [dueDateSettingsOpen, setDueDateSettingsOpen] = useState(false);
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false);

  const [dueDateOpen, setDueDateOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({ control, name: "custom_fields" });

  return (
    <div className="pt-6 flex justify-between items-start gap-6">
      <div className="flex-1 space-y-6 max-w-md">
        <TextInput
          name="quotation_number"
          label="Quotation No"
          is_required
          helperText="Auto-generated — you can edit it if needed"
        />

        <DatePickerInput name="date" label="Quotation Date" is_required placeholder="Select date" />


        <div>
          {!dueDateOpen ? (
            <button
              type="button"
              onClick={() => setDueDateOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add Due Date
            </button>
          ) : (
            <>
              <div className="mt-2">
                <div className="flex items-center gap-0">
                  <DatePickerInput
                    name="due_date"
                    label="Due Date"
                    placeholder="Select due date"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDueDateOpen(false);
                      setDueDateSettingsOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <X className="w-4 h-4 bg-red-50" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDueDateSettingsOpen((o) => !o)}
                  className="mt-1 text-xs font-medium text-primary hover:underline"
                >
                  {dueDateSettingsOpen
                    ? "Hide reminder settings"
                    : "Reminder settings"}
                </button>

                {dueDateSettingsOpen && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-24">
                      <NumberInput
                        name="reminder_days"
                        label=""
                        placeholder="3"
                        min={0}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      days before due date
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div>
          {!customFieldsOpen && fields.length === 0 ? (
            <button
              type="button"
              onClick={() => setCustomFieldsOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Custom Fields
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3">
                  <div className="w-48">
                    <TextInput name={`custom_fields.${index}.label`} label={index === 0 ? "Field Label" : ""} placeholder="Field label" />
                  </div>
                  <div className="flex-1">
                    <TextInput name={`custom_fields.${index}.value`} label={index === 0 ? "Value" : ""} placeholder="Enter value" />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive mb-2"
                    aria-label="Remove custom field"
                  >
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
            </div>
          )}
        </div>
      </div>

      <AvatarUpload name="logo" icon={Image} label="Logo" shape="square" size="lg" />


    </div>
  );
}
