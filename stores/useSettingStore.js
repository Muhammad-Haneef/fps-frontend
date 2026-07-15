import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useSettingStore = createCrudStore({
  moduleName: "Setting",
  endpoints: admin.settings,
});
