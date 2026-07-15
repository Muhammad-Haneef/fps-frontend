import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useDeliveryChallanStore = createCrudStore({
  moduleName: "DeliveryChallan",
  endpoints: admin.delivery-challans,
});
