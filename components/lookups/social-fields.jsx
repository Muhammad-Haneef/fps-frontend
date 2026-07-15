"use client";

import { use, useEffect } from "react";

import TextInput from "@/components/form/text-input";

export default function SocialFields() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextInput type="url" label="Linkedin URL" name="linkedin_url" />
        <TextInput type="url" label="Facebook URL" name="facebook_url" />
        <TextInput type="url" label="Twitter URL" name="twitter_url" />
        <TextInput type="url" label="Instagram URL" name="instagram_url" />
        <TextInput type="url" label="Youtube URL" name="youtube_url" />
        <TextInput type="url" label="Tiktok URL" name="tiktok_url" />
      </div>
    </>
  );
}
