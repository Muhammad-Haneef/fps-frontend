import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useSystemUserStore = createCrudStore({
  moduleName: "SystemUser",
  endpoints: admin.systemUsers,
});
