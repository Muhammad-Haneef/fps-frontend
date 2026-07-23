"use client";

import { use, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { useFormContext } from "react-hook-form";

import TextInput from "@/components/form/text-input";
import ImageUpload from "@/components/form/image-upload";
import DropDownByStore from "@/components/lookups/dropdown-by-store";

import { useIndustryStore } from "@/stores/meta-data/useIndustryStore";
import { useCompanyTypesStore } from "@/stores/meta-data/useCompanyTypesStore";

export default function BasicInfo() {

  const { setValue } = useFormContext();
  const searchParams = useSearchParams();
  const type_id = Number(searchParams.get("type")) || 0;

  useEffect(() => {
    if (type_id > 0) {
      setValue("type_id", Number(type_id));
    }
  }, [type_id, setValue]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-10 mb-4">
        <div className="lg:col-span-3">
          <ImageUpload label="Logo" name="logo" />
        </div>
        <div className="lg:col-span-7">
          <div className="space-y-4  mb-4">
            {/* Full width */}
            <TextInput label="Name" name="title" is_required={true} />

            {/* Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <DropDownByStore
                name="industry_id"
                label="Industry"
                useStore={useIndustryStore}
              />

              <DropDownByStore
                name="type_id"
                label="Company Type"
                required={true}
                useStore={useCompanyTypesStore}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Display Name" name="display_name" />
            <TextInput label="Unique Key" name="code" />
            <TextInput type="email" label="Email" name="email" />
            <TextInput label="Phone" name="phone" />
            <TextInput label="Mobile" name="mobile" />
            <TextInput type="url" label="Website" name="website" />
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div> */}
    </>
  );
}
