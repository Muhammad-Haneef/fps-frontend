"use client";

import { use, useEffect } from "react";
import { ModuleForm } from "../module-form";
import { PageHeader } from "@/components/layouts/admin/page-header";
import BackButton from "@/components/form/back-button";
import { useContactStore } from "@/stores/useContactStore";

export default function Page({ params }) {
  const { id } = use(params);
  const isNew = id === "add";

  const getRecord = useContactStore((s) => s.getRecord);

  useEffect(() => {
    if (!isNew) getRecord(id);
  }, [id, isNew, getRecord]);

  return (
    <div className="space-y-6">
      <PageHeader
        
        description={
          isNew
            ? "Create a new storage location."
            : `Edit your warehouse details.`
        }
        actions={<BackButton />}
      />
      <ModuleForm />
    </div>
  );
}