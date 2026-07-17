"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import TextInput from "./TextInput";
import CountrySelect from "./CountrySelect";
import StateSelect from "./StateSelect";

/**
 * AddressInput — a compound field for a full postal address, returned as a
 * single structured object rather than scattering five separate form
 * fields: { line1, line2, city, state, postalCode, country }.
 *
 * Features:
 * - Cascading Country → State (State list narrows to the chosen country;
 *   changing country clears an incompatible state selection)
 * - Optional line2 ("Apt, suite, etc.") toggled via `showLine2`
 * - Single `error` prop can be a string (applies to the whole field) or an
 *   object keyed per sub-field ({ line1: "Required", postalCode: "..." })
 */
export default function AddressInput({
  id,
  label = "Address",
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = { line1: "", line2: "", city: "", state: "", postalCode: "", country: "" },
  onChange,
  showLine2 = true,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [address, setAddress] = useControllableState({ value, defaultValue, onChange });

  const fieldErrors = typeof error === "object" && error !== null ? error : {};
  const generalError = typeof error === "string" ? error : undefined;

  function update(patch) {
    setAddress({ ...address, ...patch });
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={generalError} required={required} disabled={disabled} className={className}>
      <div className="flex flex-col gap-3">
        <TextInput
          label="Street address"
          placeholder="123 Main St"
          value={address.line1}
          onChange={(v) => update({ line1: v })}
          error={fieldErrors.line1}
          disabled={disabled}
          required={required}
        />
        {showLine2 && (
          <TextInput
            label="Apt, suite, etc. (optional)"
            placeholder="Apartment, floor, unit"
            value={address.line2}
            onChange={(v) => update({ line2: v })}
            disabled={disabled}
          />
        )}
        <div className="grid grid-cols-2 gap-3">
          <CountrySelect
            label="Country"
            value={address.country}
            onChange={(v) => update({ country: v, state: "" })}
            error={fieldErrors.country}
            disabled={disabled}
          />
          <StateSelect
            label="State / Province"
            country={address.country}
            value={address.state}
            onChange={(v) => update({ state: v })}
            error={fieldErrors.state}
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="City"
            value={address.city}
            onChange={(v) => update({ city: v })}
            error={fieldErrors.city}
            disabled={disabled}
          />
          <TextInput
            label="Postal / ZIP code"
            value={address.postalCode}
            onChange={(v) => update({ postalCode: v })}
            error={fieldErrors.postalCode}
            disabled={disabled}
          />
        </div>
      </div>
    </FieldWrapper>
  );
}
