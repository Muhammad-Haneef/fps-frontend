import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useStore = createCrudStore({
  moduleName: "State",
  endpoints: admin.states,
});
