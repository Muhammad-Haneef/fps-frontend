"use client";

import { CITIES_BY_STATE } from "@/lib/locationData";
import Autocomplete from "./Autocomplete";

/**
 * CitySelect — city field scoped by country + state. Since exhaustive city
 * lists are impractically large to ship client-side, this uses Autocomplete
 * (free text with suggestions) rather than a strict Select: it suggests
 * known cities for the chosen state (from `data`, defaulting to the
 * built-in sample) but still accepts any typed city name.
 */
export default function CitySelect({ country, state, data = CITIES_BY_STATE, ...rest }) {
  const key = `${country}-${state}`;
  const cities = country && state ? data[key] || [] : [];

  return (
    <Autocomplete
      suggestions={cities}
      placeholder={state ? "Type a city" : "Select a state first"}
      {...rest}
    />
  );
}
