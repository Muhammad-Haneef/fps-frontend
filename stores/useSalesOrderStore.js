import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useSalesOrderStore = createCrudStore({
  moduleName: "SalesOrder",
  endpoints: admin.sales-orders,
});
