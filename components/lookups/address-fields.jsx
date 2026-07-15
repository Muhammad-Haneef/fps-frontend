"use client";

import TextInput from "@/components/form/text-input";
import Countries from "@/components/lookups/countries";
import States from "@/components/lookups/states";
import Cities from "@/components/lookups/cities";

export default function AddressFields({is_required=false}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
      <div className="sm:col-span-2 lg:col-span-12">
        <TextInput label="Address" name="address" />
      </div>

      <div className="lg:col-span-3">
        <Countries  is_required={is_required} />
      </div>
      <div className="lg:col-span-3">
        <States is_required={is_required} />
      </div>
      <div className="lg:col-span-3">
        <Cities is_required={is_required} />
      </div>
      <div className="lg:col-span-3">
        <TextInput label="Postal Code" name="postal_code" />
      </div>

      <div className="sm:col-span-2 lg:col-span-12">
        <TextInput label="Google Map" name="map_link" />
      </div>
    </div>
  );
}
