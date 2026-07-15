import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const usePaymentAccountStore = createCrudStore({
  moduleName: "PaymentAccount",
  endpoints: admin.payment-accounts,
});
