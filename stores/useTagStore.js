import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useTagStore = createCrudStore({
  moduleName: "Tag",
  endpoints: admin.tags,
});
