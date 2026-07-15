import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useVoucherBookStore = createCrudStore({
  moduleName: "VoucherBook",
  endpoints: admin.coucher-books,
});
