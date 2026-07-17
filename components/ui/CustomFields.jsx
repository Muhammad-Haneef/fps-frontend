"use client";

/**
 * CustomFields — a growable list of free-form label/value pairs, used
 * anywhere a document needs "Add Custom Field"-style extensibility
 * (quotations, invoices, etc). Built on the real TextInput component, not a
 * bare <input> — the caller can restyle it via `inputClassName` the same
 * way every other formFields element supports.
 */

import TextInput from "@/components/formFields/TextInput";
import { ICONS } from "@/constants/icons";
import { LinkAction } from "./DocumentFields";
import FormField from "../formFields/FormField";

export default function CustomFields({ fields, onChange, inputClassName, addLabel = "Add Custom Fields" }) {
  return (
    <div className="flex flex-col gap-2">
      {fields.map((f, i) => (
        <div key={i} className="flex items-end gap-3">
          <div className="w-40 shrink-0">
            <FormField name={`customFields.${i}.label`}>
              <TextInput
                placeholder="Field label"
                size="sm"
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField name={`customFields.${i}.value`}>
              <TextInput
                placeholder="Enter value"
                size="sm"
              />
            </FormField>
          </div>
          <button
            type="button"
            onClick={() => onChange(fields.filter((_, idx) => idx !== i))}
            className="text-brand-500 hover:text-danger-600 pb-2"
            aria-label="Remove field"
          >
            <ICONS.x className="size-4" />
          </button>
        </div>
      ))}
      <LinkAction icon={<ICONS.plus className="size-4" />} onClick={() => onChange([...fields, { label: "", value: "" }])} className="text-brand-600">
        {addLabel}
      </LinkAction>
    </div>
  );
}
