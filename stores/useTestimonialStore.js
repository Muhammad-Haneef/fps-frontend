import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useTestimonialStore = createCrudStore({
  moduleName: "Testimonial",
  endpoints: admin.states,
});
