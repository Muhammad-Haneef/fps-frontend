"use client";

import SelectInput from "@/components/form/select-input";

export function BooleanField({label="Select", name="selected_id"}) {
  return (
    <>
      <SelectInput
        label={label}
        name={name}
        options={[
          { id: "", title: "select" },
          { id: "1", title: "Yes" },
          { id: "0", title: "No" },
        ]}
      />
    </>
  );
}
