"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileUpload } from "@/components/form";

export default function Attachments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
        <CardDescription>
          Attachments won't appear as separate documents — they'll be available as clickable links
          within the quotation. Maximum file size is 10 MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload name="attachments" label="" multiple maxFiles={10} helperText="PDF, DOC, XLS, or images (Max 10MB each)" />
      </CardContent>
    </Card>
  );
}
