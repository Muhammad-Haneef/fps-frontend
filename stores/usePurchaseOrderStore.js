import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const usePurchaseOrderStore = createCrudStore({
  moduleName: "PurchaseOrder",
  endpoints: admin.purchase-orders,
});
