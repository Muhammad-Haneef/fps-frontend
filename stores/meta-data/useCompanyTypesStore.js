import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useCompanyTypesStore = createCrudStore({
  moduleName: "CompanyType",
  endpoints: admin.companyTypes,
});
