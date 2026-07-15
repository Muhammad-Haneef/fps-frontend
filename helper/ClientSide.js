"use client";
import { usePathname } from "next/navigation";

import { Logout } from "@/helper/ServerSide";

import { toast } from "sonner";


export function useSeg(index = 0) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments[index] ?? "";
}

export const handleResponse = (response) => {
  if (!response || typeof response !== "object") {
    toast.error("No response received from API.");
    return false;
  }

  const { status, message } = response;

  if (response?.detail) {
    toast.error(message || "Your session has expired.");
    Logout();
  }

  switch (status) {
    case 200:
    case 201:
      return true;
    case 403:
      toast.error(message || "Your session has expired.");
      Logout();
      return false;
    default:
      toast.error(message || "Something went wrong.");
      return false;
  }
};


export function toNumberOrNull(val) {
  if (val === null || val === undefined || val === "") return null;
  const num = Number(val);
  return Number.isNaN(num) ? null : num;
}

export function toNumberOrBlank(val) {
  if (val === null || val === undefined || val === "") return "";
  const num = Number(val);
  return Number.isNaN(num) ? "" : num;
}

export function getCompanyTypeById(id) {
  const types = {
    1: "Suppliers",
    2: "Clients",
  };

  return types[Number(id)] ?? "Companies";
}