"use client";
import { createCrudStore } from "@/stores/factories/createCrudStore";
import { admin } from "@/api-endpoints/admin";

export const useWarehouseStore = createCrudStore({
  moduleName: "Warehouse",
  endpoints: admin.warehouses,
});
