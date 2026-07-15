import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useIndustryStore = createCrudStore({
  moduleName: "Industry",
  endpoints: admin.industries,
});
