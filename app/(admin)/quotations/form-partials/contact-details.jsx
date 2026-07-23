"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInput, PhoneInput, TextareaInput } from "@/components/form";

export default function ContactDetails() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" variant="outline" className="border-dashed" onClick={() => setOpen(true)}>
        <Phone className="w-4 h-4 mr-1.5" /> Add Contact Details
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PhoneInput name="contact_details.phone" label="Phone" placeholder="+92 21 xxxxxxx" />
        <PhoneInput name="contact_details.mobile" label="Mobile" placeholder="+92 3xx xxxxxxx" />
        <TextInput name="contact_details.email" label="Email" placeholder="contact@example.com" />
        <TextInput name="contact_details.website" label="Website" placeholder="https://example.com" />
        <div className="sm:col-span-2">
          <TextareaInput name="contact_details.address" label="Address" rows={2} placeholder="Office address" />
        </div>
      </CardContent>
    </Card>
  );
}
