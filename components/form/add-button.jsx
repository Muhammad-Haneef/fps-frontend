"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  default:
    "bg-linear-to-br from-[#ffe08a] via-[#fccc46] to-[#e8a916] text-gray-900 shadow-lg shadow-[#fccc46]/30 ring-1 ring-inset ring-white/40 hover:shadow-xl hover:shadow-[#fccc46]/50",
  plain:
    "bg-gray-900 text-white shadow-sm hover:bg-gray-800",
};

function AddButtonContent({ variation = "default" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segment = pathname.split("/").filter(Boolean)[0];
  const queryString = searchParams.toString();

  const btnClass = cn(
    "group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-md px-4 py-2 font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
    VARIANT_CLASSES[variation] ?? VARIANT_CLASSES.default
  );

  return (
    <Link
      href={`/${segment}/add${queryString ? `?${queryString}` : ""}`}
    >
      <button className={btnClass}>
        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <PlusIcon className="relative h-4 w-4 stroke-[2.5]" />
        <span className="relative text-xs">Add New</span>
      </button>
    </Link>
  );
}

export default function AddButton({ variation = "default" }) {
  return (
    <Suspense fallback={
      <div className="inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 font-semibold bg-gray-200 text-gray-500">
        <PlusIcon className="h-4 w-4 stroke-[2.5]" />
        <span className="text-xs">Add New</span>
      </div>
    }>
      <AddButtonContent variation={variation} />
    </Suspense>
  );
}