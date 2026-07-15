import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useCreditNoteStore = createCrudStore({
  moduleName: "CreditNote",
  endpoints: admin.credit-notes,
});
