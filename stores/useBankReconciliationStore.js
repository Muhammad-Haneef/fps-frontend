import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useBankReconciliationStore = createCrudStore({
  moduleName: "BankReconciliation",
  endpoints: admin.bank-reconciliations,
});
