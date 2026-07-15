"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Accordion from "@/components/accordion";
import AddressFields from "@/components/lookups/address-fields";
import SocialFields from "@/components/lookups/social-fields";

import BasicInfo from "./form-partials/basic";
import Details from "./form-partials/details";
import Tax from "./form-partials/tax";
import { Schema, FormValues } from "./form-partials/schema-values";

import FormProvider from "@/components/form/form-provider";
import FormCard from "@/components/form/card";
import FormSkeleton from "@/components/skeletons/form";

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
        value: "basic",
        trigger: "Basic Information",
        content: <BasicInfo />,
      },
      {
        value: "details",
        trigger: "Additional Details",
        content: <Details />,
      },      
      {
        value: "tax",
        trigger: "Tax Information",
        content: <Tax />,
      },
      {
        value: "address",
        trigger: "Address Information",
        content: <AddressFields />,
      },
      {
        value: "social",
        trigger: "Social Information",
        content: <SocialFields />,
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
