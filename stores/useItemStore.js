import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useItemStore = createCrudStore({
  moduleName: "Item",
  endpoints: admin.items,
});
