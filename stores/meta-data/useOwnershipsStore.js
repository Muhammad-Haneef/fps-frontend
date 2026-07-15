import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useOwnershipsStore = createCrudStore({
  moduleName: "Ownership",
  endpoints: admin.ownerships,
});
