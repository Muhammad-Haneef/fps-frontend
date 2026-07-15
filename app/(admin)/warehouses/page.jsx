"use client";

import { useEffect } from "react";


import { DataTable } from "@/components/data-tables/simple/data-table";
import { PageHeader } from "@/components/layouts/admin/page-header"
import AddButton from "@/components/form/add-button";

import { columns } from "./columns";

import {useWarehouseStore} from "@/stores/useWarehouseStore";

export default function Page() {
  
  const getRecords = useWarehouseStore((s) => s.getRecords);
  const loading = useWarehouseStore((s) => s.loading);
  const records = useWarehouseStore((s) => s.records);

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  return (
    <>
    <PageHeader actions={<AddButton />} />
    <div className="container mx-auto">
      <DataTable columns={columns} data={records} loading={loading} />
    </div>
    </>
  );
}