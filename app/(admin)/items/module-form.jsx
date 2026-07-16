"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";


// Components

import FormProvider from "@/components/form/form-provider";
import FormSkeleton from "@/components/skeletons/form";
import FormCard from "@/components/form/card";
import Accordion from "@/components/accordion";
import AddressFields from "@/components/lookups/address-fields";
import SocialFields from "@/components/lookups/social-fields";

// Form Partials
// import BasicInfo from "./form-partials/basic";
// import Details from "./form-partials/details";
// import Tax from "./form-partials/tax";
import { Schema, FormValues } from "./form-partials/schema-values";

// Form Partials
import { itemSchema, defaultValues } from "./form-partials/schema";
import Details from "./form-partials/details";
import Accounts from "./form-partials/accounts";
import PricingTax from "./form-partials/pricing-tax";
import Stock from "./form-partials/stock";
import ReorderOverstock from "./form-partials/reorder-overstock";




import { useItemStore } from "@/stores/useItemStore";





export function ModuleForm() {
  const { id } = useParams();

  const updateRecord = useItemStore((s) => s.updateRecord);
  const saveRecord = useItemStore((s) => s.saveRecord);
  const getRecord = useItemStore((s) => s.getRecord);
  const record = useItemStore((s) => s.record);
  const loading = useItemStore((s) => s.loading);

  const methods = useForm({
    resolver: zodResolver(Schema),
    mode: "onBlur",
    defaultValues: FormValues(),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (id && id !== "add") {
      getRecord(id);
    }
  }, [id, getRecord]);

  useEffect(() => {
    if (record) {
      reset(FormValues(record));
    }
  }, [record, reset]);

  const items = useMemo(
    () => [
      {
        value: "section1",
        trigger: "1. Item/Product Details",
        content: <Details />,
      },
      {
        value: "section2",
        trigger: "2. Accounting Details",
        content: <Accounts />,
      },
      {
        value: "section3",
        trigger: "3. Pricing & Taxation",
        content: <PricingTax />,
      },
      {
        value: "section4",
        trigger: "4. Stock Management",
        content: <Stock />,
      },
      {
        value: "section5",
        trigger: "5. Reorder & Overstock",
        content: <ReorderOverstock />,
      },
    ],
    [],
  );

  const onSubmit = async (formValues) => {
    try {
      const data = new FormData();

      Object.entries(formValues).forEach(([key, value]) => {
        if (key === "logo") {
          if (value instanceof File) {
            data.append("logo", value);
          }
        } else {
          data.append(key, value ?? "");
        }
      });
      //return false;
      if (formValues.id > 0) {
        //alert("update")
        await updateRecord(formValues);
      } else {
        //alert("save")
        await saveRecord(formValues);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Something went wrong.");
    }
  };

  if (loading) {
    return <FormSkeleton rows={10} columns={2} />;
  }

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <FormCard title="" formState={isSubmitting}>
        <Accordion items={items} defaultValue={["basic"]} />
      </FormCard>
    </FormProvider>
  );
}
