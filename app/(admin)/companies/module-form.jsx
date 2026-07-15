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
import Tax from "./form-partials/tax";
import Details from "./form-partials/details";
import Banks from "./form-partials/banks";
import Invoice from "./form-partials/invoice";
import Account from "./form-partials/account";
import { Schema, FormValues } from "./form-partials/schema-values";

import FormProvider from "@/components/form/form-provider";
import FormCard from "@/components/form/card";
import FormSkeleton from "@/components/skeletons/form";

import { useCompanyStore } from "@/stores/useCompanyStore";

export function ModuleForm() {
  const { id } = useParams();

  const { updateRecord, saveRecord, getRecord, record, loading } =
    useCompanyStore();

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
        value: "contacts",
        trigger: "Company Contacts",
        content: <a href="#">Link</a>,
      },
      {
        value: "details",
        trigger: "Additional Details",
        content: <Details />,
      },
      {
        value: "attachments",
        trigger: "Attachments",
        content: <a href="#">Link</a>,
      },
      {
        value: "banks",
        trigger: "Banks Detail",
        content: <Banks />,
      },
      {
        value: "invoice",
        trigger: "Invoice Information",
        content: <Invoice />,
      },
      {
        value: "social",
        trigger: "Social Information",
        content: <SocialFields />,
      },
      {
        value: "account",
        trigger: "Account Information",
        content: <Account />,
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
      /*
console.log("formValues")
console.log(formValues)
console.log("data")
console.log([...data.entries()]);
*/
//return false;
      if (formValues.id > 0) {
        await updateRecord(formValues);
      } else {
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

  console.log("errors 135");
  console.log(errors);

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <FormCard title="" formState={isSubmitting}>
        <Accordion items={items} className="border" defaultValue={["basic"]} />
      </FormCard>
    </FormProvider>
  );
}
