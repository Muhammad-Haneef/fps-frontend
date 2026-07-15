"use client";

import { useEffect } from "react";
import SelectInput from "@/components/form/select-input";
import { useCountryStore } from "@/stores/useCountryStore";

export default function Countries({ label = "Country", name = "country_id", is_required=false }) {
  const getForDropdown = useCountryStore((s) => s.getForDropdown);
  const forDropdown = useCountryStore((s) => s.forDropdown);
  const loading = useCountryStore((s) => s.loading);

  useEffect(() => {
    getForDropdown();
  }, [getForDropdown]);

  return <SelectInput label={label} name={name} loading={loading} options={forDropdown} is_required={is_required} />;
}
