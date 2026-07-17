"use client";

import { STATES_BY_COUNTRY } from "@/lib/locationData";
import Select from "./Select";

/**
 * StateSelect — a Select whose options depend on the selected country.
 * Pass `country` (an ISO code matching your CountrySelect's value) and it
 * looks up the matching state list from `data` (defaults to the built-in
 * `STATES_BY_COUNTRY` sample — pass your own for full coverage).
 *
 * Disables itself with a helpful placeholder when no country is chosen yet.
 */
export default function StateSelect({ country, data = STATES_BY_COUNTRY, disabled, ...rest }) {
  const states = country ? data[country] || [] : [];
  const options = states.map((s) => ({ value: s, label: s }));
  const noCountry = !country;

  return (
    <Select
      options={options}
      placeholder={noCountry ? "Select a country first" : states.length ? "Select a state" : "No states available"}
      disabled={disabled || noCountry || states.length === 0}
      {...rest}
    />
  );
}
