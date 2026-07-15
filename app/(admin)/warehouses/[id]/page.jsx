"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { WarehouseForm } from "../warehouse-form";
import { PageHeader } from "@/components/layouts/admin/page-header";
import BackButton from "@/components/form/back-button";



import { useWarehouseStore } from "@/stores/useWarehouseStore";

export default function Page() {
  const { id } = useParams();
  const isNew = id === "add";

  const loading = useWarehouseStore((s) => s.loading);
  const getRecord = useWarehouseStore((s) => s.getRecord);
  const clearRecord = useWarehouseStore((s) => s.clearRecord);
/*
  useEffect(() => {
    clearRecord();
    if (!isNew) {
      getRecord(id);
    }
  }, [id, isNew, getRecord, clearRecord]);
  */

  useEffect(() => {
    console.log("Effect", id);

    clearRecord();

    if (!isNew) {
      getRecord(id);
    }
  }, []);


  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Add Warehouse" : "Edit Warehouse"}
        description={
          isNew
            ? "Create a new storage location."
            : `Edit your warehouse details.`
        }
        actions={<BackButton />}
      />
      <WarehouseForm loading={loading}  />
    </div>
  );
}
