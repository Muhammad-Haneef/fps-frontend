"use client";

import { use, useEffect } from "react";

import TextInput from "@/components/form/text-input";

export default function Tax() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextInput label="Tax Number" name="tax_number" />
      </div>
    </>
  );
}
