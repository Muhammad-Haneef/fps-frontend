import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useGreetingStore = createCrudStore({
  moduleName: "Greeting",
  endpoints: admin.greetings,
});
