import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useCompanyStore = createCrudStore({
  moduleName: "Company",
  endpoints: admin.companies,
});
