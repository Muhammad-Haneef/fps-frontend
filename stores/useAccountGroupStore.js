import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useAccountGroupStore = createCrudStore({
  moduleName: "AccountGroup",
  endpoints: admin.account-groups,
});
