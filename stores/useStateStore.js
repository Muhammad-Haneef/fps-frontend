import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useStateStore = createCrudStore({
  moduleName: "State",
  endpoints: admin.states,
});
