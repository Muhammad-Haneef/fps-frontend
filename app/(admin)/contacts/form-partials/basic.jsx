"use client";


import TextInput from "@/components/form/text-input";
import ImageUpload from "@/components/form/image-upload";
import DropDownByStore from "@/components/lookups/dropdown-by-store";

import { useCompanyStore } from "@/stores/useCompanyStore";

export default function BasicInfo() {

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-10 mb-4">
        <div className="lg:col-span-3">
          <ImageUpload label="Image" name="image" />
        </div>
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Name" name="name" is_required={true} />
            <DropDownByStore
              name="company_id"
              label="Company"
              useStore={useCompanyStore}
            /> 

            <TextInput type="email" label="Email" name="email" />
            <TextInput label="Phone" name="phone" />
            <TextInput label="Mobile" name="mobile" />
          </div>
        </div>
      </div>
    </>
  );
}
