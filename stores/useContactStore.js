import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useContactStore = createCrudStore({
  moduleName: "Contact",
  endpoints: admin.contacts,
});
