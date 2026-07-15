import { Landmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Bank() {
  return (
    <div className="flex flex-col items-center justify-center border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
        <Landmark className="h-8 w-8 text-slate-500" />
      </div>

      <h4 className="text-xl font-semibold text-slate-700">
        Add Bank Account Details
      </h4>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        Record all payments made to your Vendor's Bank Accounts against this and
        future Purchases.
      </p>

      <Button className="mt-3 px-8">
        <Plus className="mr-2 h-4 w-4" />
        Add Bank Account
      </Button>
    </div>
  );
}
