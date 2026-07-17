"use client";

import { useEffect } from "react";
import { useFormContext } from "@/lib/FormContext";

/**
 * HiddenInput — carries a value in the form's data (csrf token, record id,
 * UTM params, computed values) without rendering any visible UI.
 *
 * If used inside a <Form>, it registers its value into form state on mount
 * (and whenever `value` changes) so it's included in `values` on submit.
 * If used standalone, it just renders a native <input type="hidden">.
 */
export default function HiddenInput({ name, value }) {
  const form = useFormContext();

  useEffect(() => {
    if (form) form.setFieldValue(name, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, value]);

  if (form) return null; // value lives in form state instead of the DOM
  return <input type="hidden" name={name} value={value ?? ""} readOnly />;
}
