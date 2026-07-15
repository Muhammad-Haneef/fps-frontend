"use client";
import { useEffect } from "react";

import SelectInput from "@/components/form/select-input";

import { useCityStore } from "@/stores/useCityStore";

export default function Citys({ label = "City", name = "city_id", is_required=false }) {
  const getForDropdown = useCityStore((s) => s.getForDropdown);
  const forDropdown = useCityStore((s) => s.forDropdown);
  const loading = useCityStore((s) => s.loading);
  useEffect(() => {
    getForDropdown({ is_active: 1 });
  }, [getForDropdown]);
  return (
    <>
      <SelectInput label={label} name={name} loading={loading} options={forDropdown} is_required={is_required} />
    </>
  );
}
