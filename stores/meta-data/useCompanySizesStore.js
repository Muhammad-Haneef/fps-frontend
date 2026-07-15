import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useCompanySizesStore = createCrudStore({
  moduleName: "CompanySize",
  endpoints: admin.companySizes,
});
