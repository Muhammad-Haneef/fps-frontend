import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useChartOfAccountStore = createCrudStore({
  moduleName: "ChartOfAccount",
  endpoints: admin.chartOfAccounts,
});
