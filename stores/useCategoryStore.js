import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useCategoryStore = createCrudStore({
  moduleName: "Cayegory",
  endpoints: admin.categories,
});
