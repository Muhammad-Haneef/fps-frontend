import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useUnitsStore = createCrudStore({
  moduleName: "Units",
  endpoints: admin.units,
});
