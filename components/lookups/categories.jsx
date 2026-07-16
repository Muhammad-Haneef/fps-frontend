"use client";

import { Fragment, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCategoryStore } from "@/stores/useCategoryStore";

export default function Categories({
  label = "Category",
  name = "category_id",
  is_required = false,
}) {
  const getForDropdown = useCategoryStore((s) => s.getForDropdown);
  const forDropdown = useCategoryStore((s) => s.forDropdown);
  const loading = useCategoryStore((s) => s.loading);

  useEffect(() => {
    getForDropdown();
  }, [getForDropdown]);

  return (
    <Select name={name} required={is_required} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Loading..." : label} />
      </SelectTrigger>

      <SelectContent>
        {forDropdown?.map((item) => (
          <Fragment key={item.id}>
            <SelectGroup>
              <SelectLabel>{item.title}</SelectLabel>

              {item.children?.map((child) => (
                <SelectItem key={child.id} value={String(child.title)}>
                  {child.title}
                </SelectItem>
              ))}
            </SelectGroup>

            <SelectSeparator />
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}