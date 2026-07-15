import { API_DOMAIN } from "@/constants/general";

export const createCrudEndpoints = (module) => ({
  get: `${API_DOMAIN}/${module}`,
  getForDropdown: `${API_DOMAIN}/${module}/get-for-dropdown`,
  record: (id) => `${API_DOMAIN}/${module}/${id}`,

  save: `${API_DOMAIN}/${module}`,
  update: (id) => `${API_DOMAIN}/${module}/${id}`,

  trash: (id) => `${API_DOMAIN}/${module}/trash/${id}`,
  restore: (id) => `${API_DOMAIN}/${module}/restore/${id}`,

  destroy: (id) => `${API_DOMAIN}/${module}/${id}`,
});
