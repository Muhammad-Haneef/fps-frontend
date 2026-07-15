"use client";

import { use, useEffect } from "react";

import TextInput from "@/components/form/text-input";
import TextareaInput from "@/components/form/textarea-input";
import CheckboxInput from "@/components/form/checkbox-input";

export default function Invoice() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start mb-4">
        <TextInput label="Default Invoice Due Day(s)" name="default_due_days" />

        <CheckboxInput
          name="show_email_on_invoice"
          label="Show Email on Invoice"
          className="mt-4"
        />

        <CheckboxInput
          name="show_phone_on_invoice"
          label="Show Phone on Invoice"
          className="mt-4"
        />

        <CheckboxInput
          name="show_address_on_invoice"
          label="Show Address on Invoice"
          className="mt-4"
        />
      </div>
      <div className="">
        <TextareaInput label="Notes" name="invoice_notes" />
      </div>
    </>
  );
}
