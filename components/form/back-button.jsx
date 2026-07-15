"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // optional: an icon

export default function BackButton({ label = "Back", variant = "default" }) {
  const router = useRouter();

  return (
    // <Button className="cursor-pointer text-xs shadow-[#fccc46]/30" onClick={() => router.back()} variant={variant}>
    <Button className="cursor-pointer text-xs rounded-md px-4 py-2 shadow-[#fccc46]/30" onClick={() => router.back()} variant={variant}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
