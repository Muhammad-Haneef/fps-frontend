"use client";

import { use, useEffect } from "react";
import ModuleForm from "../module-form";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

import Stepper from "@/components/steper";

export default function WarehousePage({ params }) {
  const { id } = use(params);
  const isNew = id === "add";

  const getRecord = useWarehouseStore((s) => s.getRecord);

  useEffect(() => {
    if (!isNew) getRecord(id);
  }, [id, isNew, getRecord]);

  return (
    <div className="space-y-6">
      <Stepper
        steps={[
          { title: "Quotation Details" },
          { title: "Design & Share" },
        ]}
        currentStep={1}
      />
      <ModuleForm />
    </div>
  );
}