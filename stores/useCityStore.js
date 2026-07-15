import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useCityStore = createCrudStore({
  moduleName: "City",
  endpoints: admin.cities,
});
