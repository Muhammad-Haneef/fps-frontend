import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useExpenditureStore = createCrudStore({
  moduleName: "Expenditure",
  endpoints: admin.expenditures,
});
