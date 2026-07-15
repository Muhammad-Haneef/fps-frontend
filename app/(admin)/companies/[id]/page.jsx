"use client";

import { use, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import {getCompanyTypeById} from "@/helper/ClientSide"

import { ModuleForm } from "../module-form";
import { PageHeader } from "@/components/layouts/admin/page-header";
import BackButton from "@/components/form/back-button";
//import { useCompanyStore } from "@/stores/useCompanyStore";

export default function Page({ params }) {
  //export default function Page() {

  const searchParams = useSearchParams();
  const type_id = Number(searchParams.get("type")) || 0;

  const { id } = use(params);
  const isNew = id === "add";

  /*
  const getRecord = useCompanyStore((s) => s.getRecord);
  const loading = useCompanyStore((s) => s.loading);
  useEffect(() => {
    if (!isNew) getRecord(id);
  }, [id, isNew, getRecord]);
  */

  return (
    <div className="space-y-6">
      <PageHeader
        description={
          isNew
            ? "Create"
            : `Edit`
        }
        actions={<BackButton />}
        title={getCompanyTypeById(type_id)}
      />
      <ModuleForm />
    </div>
  );
}
