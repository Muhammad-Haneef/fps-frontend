import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useRoleStore = createCrudStore({
  moduleName: "Role",
  endpoints: admin.roles,
});
