import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useSourceTypesStore = createCrudStore({
  moduleName: "SourceType",
  endpoints: admin.sourceTypes,
});
