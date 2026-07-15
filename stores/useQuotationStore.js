import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useQuotationStore = createCrudStore({
  moduleName: "Quotation",
  endpoints: admin.quotations,
});
