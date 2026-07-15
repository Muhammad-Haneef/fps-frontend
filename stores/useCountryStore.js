import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useCountryStore = createCrudStore({
  moduleName: "Country",
  endpoints: admin.countries,
});
