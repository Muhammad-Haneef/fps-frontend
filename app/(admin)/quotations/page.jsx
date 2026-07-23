"use client";

import { useEffect } from "react";

import { DataTable } from "@/components/data-tables/simple/data-table";
import { PageHeader } from "@/components/layouts/admin/page-header"
import AddButton from "@/components/form/add-button";

import { Columns } from "./columns";

import {useQuotationStore} from "@/stores/useQuotationStore";

export default function Page() {
  

  const getRecords = useQuotationStore((s) => s.getRecords);
  const records = useQuotationStore((s) => s.records);

  useEffect(() => {
    getRecords();
  }, [getRecords]);


  return (
    <>
    <PageHeader actions={<AddButton />} />
    <div className="container mx-auto">
      <DataTable columns={Columns} data={records} />
    </div>
    </>
  );
}