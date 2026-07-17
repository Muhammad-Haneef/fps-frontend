"use client";

import { cn } from "@/lib/utils";

/**
 * FormGroup — lays out a set of related fields side by side (responsive: stacks on mobile).
 *
 * Usage:
 *   <FormGroup columns={2}>
 *     <FormField name="firstName"><TextInput label="First name" /></FormField>
 *     <FormField name="lastName"><TextInput label="Last name" /></FormField>
 *   </FormGroup>
 */
export default function FormGroup({ children, columns = 2, gap = "gap-4", className }) {
  const colClass = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[columns] || "sm:grid-cols-2";
  return (
    <div className={cn("grid grid-cols-1", colClass, gap, className)}>
      {children}
    </div>
  );
}
