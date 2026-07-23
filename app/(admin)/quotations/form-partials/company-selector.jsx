"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInput, SelectInput, PhoneInput } from "@/components/form";

const COUNTRY_OPTIONS = [
  { title: "Pakistan", id: "1" },
  { title: "United Arab Emirates", id: "2" },
  { title: "United States", id: "3" },
  { title: "United Kingdom", id: "4" },
];

const BUSINESS_OPTIONS = [
  { id: "1", title: "FORKLIFT PARTS & SERVICES (PVT) LTD." },
];


export default function CompanySelector() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation From</CardTitle>
        <CardDescription>Your business details as they'll appear on the document</CardDescription>
        <SelectInput
          name="business_id"
          label="Business Name"
          placeholder="Select a business"
          options={BUSINESS_OPTIONS}
          is_required
          value="1"
        />
      </CardHeader>
      <CardContent className="grid grid-cols-1  gap-4">
        {/*
        <div className="sm:col-span-2">
          <TextInput name="business.name" label="Business Name" is_required placeholder="Your business name" />
        </div>
        <div className="sm:col-span-2">
          <TextInput name="business.address" label="Address" placeholder="Street address" />
        </div>
        <TextInput name="business.city" label="City" placeholder="Karachi" />
        <SelectInput name="business.country" label="Country" placeholder="Select country" options={COUNTRY_OPTIONS} />
        <PhoneInput name="business.phone" label="Phone" placeholder="+92 3xx xxxxxxx" />
        <TextInput name="business.email" label="Email" placeholder="business@example.com" />
        <TextInput name="business.ntn" label="NTN" placeholder="National Tax Number" />
        <TextInput name="business.gst" label="GST / Sales Tax No." placeholder="Optional" />
        */}

        <div>
          <h6 className="my-2 font-bold">
            FORKLIFT PARTS & SERVICES
          </h6>
          <p>
            Plot # 668 Jahangeer Road # 01 , Karachi, Sindh, Pakistan. <br /> NTN # 5174567-8
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
