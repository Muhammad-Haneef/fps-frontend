import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const usePaymentReceiptStore = createCrudStore({
  moduleName: "PaymentReceipt",
  endpoints: admin.payment-receipts,
});
