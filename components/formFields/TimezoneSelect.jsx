"use client";

import { useMemo } from "react";
import { getTimezones } from "@/lib/locationData";
import Select from "./Select";

/**
 * TimezoneSelect — Select over every IANA timezone the browser supports
 * (via `Intl.supportedValuesOf`, with a small fallback list on older
 * browsers), each labeled with its current UTC offset and sorted west→east.
 */
export default function TimezoneSelect({ ...rest }) {
  const timezones = useMemo(() => getTimezones(), []);
  const options = timezones.map((tz) => ({ value: tz.value, label: tz.label, description: tz.offsetLabel }));

  return <Select options={options} placeholder="Select a timezone" {...rest} />;
}
