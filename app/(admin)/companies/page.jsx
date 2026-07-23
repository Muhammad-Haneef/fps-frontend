"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import {getCompanyTypeById} from "@/helper/ClientSide"

import { DataTable } from "@/components/data-tables/simple/data-table";
import { PageHeader } from "@/components/layouts/admin/page-header";
import AddButton from "@/components/form/add-button";

import { Columns } from "./columns";

import { useCompanyStore } from "@/stores/useCompanyStore";

function PageContent() {
  const searchParams = useSearchParams();

  const type_id = Number(searchParams.get("type")) || 0;

  const getRecords = useCompanyStore((s) => s.getRecords);
  const records = useCompanyStore((s) => s.records);
  const loading = useCompanyStore((s) => s.loading);

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  
  const filteredRecords =
    type_id > 0
      ? records.filter((record) => record.type_id === type_id)
      : records;

  return (
    <>
      <PageHeader
        actions={<AddButton />}
        title={getCompanyTypeById(type_id)}
      />
      <div className="container mx-auto">
        {/* <DataTable columns={Columns} data={records} loading={loading} /> */}
        <DataTable columns={Columns} data={filteredRecords} loading={loading} />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
