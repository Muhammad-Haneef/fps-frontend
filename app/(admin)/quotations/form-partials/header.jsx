"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { TextInput, AvatarUpload } from "@/components/form";

export default function Header() {
  const { control } = useFormContext();
  const [subtitleOpen, setSubtitleOpen] = useState(false);
  const subtitle = useWatch({ control, name: "subtitle" });
  const { setValue } = useFormContext();

  return (
    <div className="relative text-center pt-4 pb-6">
      <div className="max-w-sm mx-auto">
        <TextInput
          name="title"
          label=""
          placeholder="QUOTATION"
          is_required
          helperText="This appears as the document heading"
          className="border-none text-xl font-bold"
        />
      </div>

      {subtitleOpen || subtitle ? (
        <div className="max-w-sm mx-auto mt-2 relative">
          <TextInput name="subtitle" label="" placeholder="Add a subtitle" />
          <button
            type="button"
            onClick={() => {
              setValue("subtitle", "");
              setSubtitleOpen(false);
            }}
            className="absolute right-0 top-0 text-muted-foreground hover:text-destructive"
            aria-label="Remove subtitle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setSubtitleOpen(true)}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Subtitle
        </button>
      )}
    </div>
  );
}
