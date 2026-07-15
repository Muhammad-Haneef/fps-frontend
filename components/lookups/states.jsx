"use client";
import { useEffect } from "react";

import SelectInput from "@/components/form/select-input";

import { useStateStore } from "@/stores/useStateStore";

export default function States({ label = "State", name = "state_id", is_required=false }) {
  const getForDropdown = useStateStore((s) => s.getForDropdown);
  const forDropdown = useStateStore((s) => s.forDropdown);
  const loading = useStateStore((s) => s.loading);
  useEffect(() => {
    getForDropdown({ is_active: 1 });
  }, [getForDropdown]);
  return (
    <>
      <SelectInput label={label} name={name} loading={loading} options={forDropdown} is_required={is_required} />
    </>
  );
}
