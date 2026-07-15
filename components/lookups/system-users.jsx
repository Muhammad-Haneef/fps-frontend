"use client";

import { useEffect } from "react";
import SelectInput from "@/components/form/select-input";
import { useSystemUserStore } from "@/stores/useSystemUserStore";

export default function SystemUsers({ label = "User", name = "system_user_id", is_required=false }) {
  const getForDropdown = useSystemUserStore((s) => s.getForDropdown);
  const forDropdown = useSystemUserStore((s) => s.forDropdown);
  const loading = useSystemUserStore((s) => s.loading);

  useEffect(() => {
    getForDropdown({ is_active: 1 });
  }, [getForDropdown]);

  return <SelectInput label={label} name={name} loading={loading} options={forDropdown} labelKey="name" is_required={is_required} />;
}
