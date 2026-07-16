"use client";
import { useEffect } from "react";
import { SelectInput } from "@/components/form";

import { useChartOfAccountStore } from "@/stores/useChartOfAccountStore";


/* ------------------------------------------------------------------ */
/* 2. Accounting Details                                               */
/* ------------------------------------------------------------------ */

export default function Accounts() {

  const getForDropdown = useChartOfAccountStore((s) => s.getForDropdown);
  const forDropdown = useChartOfAccountStore((s) => s.forDropdown);

  useEffect(() => {
    getForDropdown();
  }, [getForDropdown]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-4">
        <SelectInput
          name="purchase_ledger_id"
          label="Purchase Ledger"
          helperText="The ledger account where you record the purchase of this item"
          placeholder="Select Ledger"
          options={forDropdown}
        />
        <SelectInput
          name="sale_ledger_id"
          label="Sales Ledger"
          helperText="The ledger account where you record the sales of this item"
          placeholder="Select Ledger"
          options={forDropdown}
        />
      </div>
      <div>
        <SelectInput
          name="inventory_ledger_id"
          label="Inventory Ledger"
          helperText="The ledger account where you record the inventory of this item"
          placeholder="Select Ledger"
          options={forDropdown}
        />
      </div>
    </>
  );
}
