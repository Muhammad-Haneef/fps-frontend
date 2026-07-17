"use client";

import { COUNTRIES } from "@/lib/locationData";
import Select from "./Select";

/**
 * CountrySelect — thin preset over `Select` with flag emoji + country name,
 * searchable by name or ISO code. Pass `countries` to override the built-in
 * list (e.g. to restrict to countries you actually ship to).
 */
export default function CountrySelect({ countries = COUNTRIES, valueKey = "code", ...rest }) {
  const options = countries.map((c) => ({
    value: c[valueKey],
    label: c.name,
    icon: <span className="text-base leading-none">{c.flag}</span>,
  }));

  return <Select options={options} placeholder="Select a country" {...rest} />;
}
