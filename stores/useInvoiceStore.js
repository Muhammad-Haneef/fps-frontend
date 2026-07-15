import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useInvoiceStore = createCrudStore({
  moduleName: "Invoice",
  endpoints: admin.invoices,
});
