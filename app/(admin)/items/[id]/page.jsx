"use client";

import { use, useEffect } from "react";
import { ModuleForm } from "../module-form";
import { PageHeader } from "@/components/layouts/admin/page-header";
import BackButton from "@/components/form/back-button";
import { useItemStore } from "@/stores/useItemStore";

export default function Page({ params }) {
  const { id } = use(params);
  const isNew = id === "add";

  const getRecord = useItemStore((s) => s.getRecord);

  useEffect(() => {
    if (!isNew) getRecord(id);
  }, [id, isNew, getRecord]);

  return (
    <div className="space-y-6">
      <PageHeader

        description={
          isNew
            ? "Create a new item."
            : `Edit your item details.`
        }
        actions={<BackButton />}
      />
      <ModuleForm />
    </div>
  );
}