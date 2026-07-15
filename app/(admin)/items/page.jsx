"use client";

import { useEffect } from "react";

import { DataTable } from "@/components/data-tables/simple/data-table";
import { PageHeader } from "@/components/layouts/admin/page-header"
import AddButton from "@/components/form/add-button";

import { Columns } from "./columns";

import {useItemStore} from "@/stores/useItemStore";

export default function Page() {
  

  const getRecords = useItemStore((s) => s.getRecords);
  const loading = useItemStore((s) => s.loading);
  const records = useItemStore((s) => s.records);

  useEffect(() => {
    getRecords();
  }, [getRecords]);


  return (
    <>
    <PageHeader actions={<AddButton />} />
    <div className="container mx-auto">
      <DataTable columns={Columns} data={records} loading={loading} />
    </div>
    </>
  );
}