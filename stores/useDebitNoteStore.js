import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useDebitNoteStore = createCrudStore({
  moduleName: "DebitNote",
  endpoints: admin.debit-notes,
});
