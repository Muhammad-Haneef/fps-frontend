"use client";

import { LANGUAGES } from "@/lib/locationData";
import Select from "./Select";

/**
 * LanguageSelect — thin preset over `Select` with the built-in language
 * list (ISO 639-1 codes + display names). Pass `languages` to override.
 */
export default function LanguageSelect({ languages = LANGUAGES, ...rest }) {
  const options = languages.map((l) => ({ value: l.code, label: l.name, description: l.code.toUpperCase() }));
  return <Select options={options} placeholder="Select a language" {...rest} />;
}
