"use client";

import { CURRENCIES } from "@/lib/locationData";
import Select from "./Select";

/**
 * CurrencySelect — thin preset over `Select` with the built-in currency
 * list (code, name, symbol). Pass `currencies` to override.
 */
export default function CurrencySelect({ currencies = CURRENCIES, ...rest }) {
  const options = currencies.map((c) => ({
    value: c.code,
    label: `${c.code} — ${c.name}`,
    icon: <span className="text-neutral-400 w-4 text-center">{c.symbol}</span>,
  }));
  return <Select options={options} placeholder="Select a currency" {...rest} />;
}
