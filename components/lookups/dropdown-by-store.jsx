"use client";

import { useEffect } from "react";
import SelectInput from "@/components/form/select-input";

function useNoopStore(selector) {
  const state = {
    forDropdown: [],
    getForDropdown: () => {
      alert(
        "Please configure a store for this dropdown (useStore prop is missing).",
      );
    },
    loading: false,
  };
  return selector ? selector(state) : state;
}

export default function DropDownByStore({
  label = "Data",
  name = "data_id",
  useStore,
  required = false,
}) {
  const activeStore = useStore ?? useNoopStore;

  const getForDropdown = activeStore((s) => s.getForDropdown);
  const loading = activeStore((s) => s.loading);
  const forDropdown = activeStore((s) => s.forDropdown);

  useEffect(() => {
    getForDropdown?.();
  }, [getForDropdown]);

  return (
    <SelectInput
      label={label}
      name={name}
      options={forDropdown}
      loading={loading}
      is_required={required}
    />
  );
}
