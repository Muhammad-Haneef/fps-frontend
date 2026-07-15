"use client";

import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";

export default function AppAccordion({
  items,
  className,
  defaultValue = ["billing"],
}) {
  return (
    <ShadcnAccordion
      type="multiple"
      defaultValue={defaultValue}
      className={cn("rounded-md", className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className="border-b px-4 last:border-b-0"
        >
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </ShadcnAccordion>
  );
}