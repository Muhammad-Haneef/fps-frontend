"use client";

import { SelectInput } from "@/components/form";
import { Section } from "./FormHelpers";
import { LEDGER_OPTIONS } from "./formConstants";

/* ------------------------------------------------------------------ */
/* 2. Accounting Details                                               */
/* ------------------------------------------------------------------ */

export default function Accounts() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-4">
        <SelectInput
          name="purchaseLedger"
          label="Purchase Ledger"
          helperText="The ledger account where you record the purchase of this item"
          placeholder="Select Ledger"
          options={LEDGER_OPTIONS}
        />
        <SelectInput
          name="salesLedger"
          label="Sales Ledger"
          helperText="The ledger account where you record the sales of this item"
          placeholder="Select Ledger"
          options={LEDGER_OPTIONS}
        />
      </div>
      <div>
        <SelectInput
          name="inventoryLedger"
          label="Inventory Ledger"
          helperText="The ledger account where you record the inventory of this item"
          placeholder="Select Ledger"
          options={LEDGER_OPTIONS}
        />
      </div>
    </>
  );
}
