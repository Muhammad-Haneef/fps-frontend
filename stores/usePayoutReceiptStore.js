import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const usePayoutReceiptStore = createCrudStore({
  moduleName: "PayoutReceipt",
  endpoints: admin.payout-receipts,
});
