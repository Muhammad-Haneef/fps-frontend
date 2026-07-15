"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormProvider from "@/components/form/form-provider";
import FormCard from "@/components/form/card";
import TextInput from "@/components/form/text-input";

import AddressFields from "@/components/lookups/address-fields";
import SystemUsers from "@/components/lookups/system-users";
import { BooleanField } from "@/components/lookups/common-fields";

import FormSkeleton from "@/components/skeletons/form";

import { useWarehouseStore } from "@/stores/useWarehouseStore";

import { Schema, FormValues } from "./form-partials/schema-values";

export function WarehouseForm({ loading = false }) {
  const updateRecord = useWarehouseStore((s) => s.updateRecord);
  const saveRecord = useWarehouseStore((s) => s.saveRecord);
  const record = useWarehouseStore((s) => s.record);

  const defaultValues = useMemo(() => {
    FormValues();
  }, [record]);

  const methods = useForm({
    resolver: zodResolver(Schema),
    mode: "onBlur",
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  /*
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
  */

  useEffect(() => {
    reset(FormValues(record));
  }, [record, reset]);

  const onSubmit = async (formData) => {
    try {
      if (formData.id > 0) {
        await updateRecord(formData);
      } else {
        await saveRecord(formData);
      }
    } catch (error) {
      console.error("Warehouse form error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  console.log("record");
  console.log(record);

  if (loading) {
    return <FormSkeleton rows={10} columns={2} />;
  }

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <FormCard title="Warehouse Information" formState={isSubmitting}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-10">
          <div className="lg:col-span-7">
            <TextInput label="Name" name="title" is_required="true" />
          </div>

          <div className="lg:col-span-3">
            <TextInput label="Warehouse Code" name="code" is_required="true" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SystemUsers label="Manager" is_required={true} />
          <TextInput label="Warehouse Contact" name="contact" />
        </div>

        <AddressFields is_required={true} />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <TextInput label="Dimensions" name="dimensions" />
          <TextInput type="number" label="Sort Order" name="sort_by" />
          <BooleanField label="Is Default" name="is_default" />
          <BooleanField label="Is Active" name="is_active" />
        </div>
      </FormCard>
    </FormProvider>
  );
}
