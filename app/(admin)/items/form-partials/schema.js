
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Validation schema                                                   */
/* ------------------------------------------------------------------ */
export const Schema = z.object({
  // Basic Information
  id: z.number().default(0),
  product_type: z.string().optional(),
  category_id: z.string().optional(),
  saleable: z.string().optional(),
  manage_stock: z.string().optional(),
  thumbnail: z.any().optional(),
  images: z.array(z.any()).optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  sku: z.string().optional(),
  qty_unit_id: z.string().optional(),
  description: z.string().optional(),

  // Vendors & Tags
  registered_verdors: z.array(z.string()).optional(),
  prefered_verdors: z.array(z.string()).optional(),
  tag_ids: z.array(z.string()).optional(),

  // Dimensions
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  dimension_unit_id: z.string().optional(),

  // Weight
  gross_weight: z.string().optional(),
  net_weight: z.string().optional(),
  weight_unit_id: z.string().optional(),

  // Custom Fields
  custom_fields: z
    .array(
      z.object({
        key: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),

  // Pricing
  buying_price: z.string().optional(),
  selling_price: z.string().optional(),
  landed_cost: z.string().optional(),
  tax_rate: z.string().optional(),

  // Reorder Levels
  reordering_point: z.string().optional(),
  overstock_point: z.string().optional(),

  warehouseReorder: z
    .array(
      z.object({
        warehouse_id: z.string().optional(),
        reordering_point: z.string().optional(),
        overstock_point: z.string().optional(),
      })
    )
    .optional(),

  // Stock
  strick_stock_control: z.number().optional(),
  initial_stock: z.string().optional(),
  tracking_method: z.string().optional(),
  warehouseStock: z
    .array(
      z.object({
        warehouse_id: z.string().optional(),
        stock: z.string().optional(),
      })
    )
    .optional(),

  // Ledgers
  purchase_ledger_id: z.string().optional(),
  sale_ledger_id: z.string().optional(),
  inventory_ledger_id: z.string().optional(),
});

export const FormValues = (record = {}) => ({
  // Basic Information
  id: record?.id ?? 0,
  product_type: record?.product_type ?? "product",
  category_id: record?.category_id ?? "",
  saleable: String(record?.saleable ?? "0"),
  manage_stock: String(record?.manage_stock ?? "0"),
  thumbnail: record?.thumbnail ?? null,
  images: record?.images ?? [],
  title: record?.title ?? "",
  sku: record?.sku ?? "",
  qty_unit_id: record?.qty_unit_id ?? "",
  description: record?.description ?? "",

  // Vendors & Tags
  registered_verdors: record?.registered_verdors ?? [],
  prefered_verdors: record?.prefered_verdors ?? [],
  tag_ids: record?.tag_ids ?? [],

  // Dimensions
  length: record?.length ?? "",
  width: record?.width ?? "",
  height: record?.height ?? "",
  dimension_unit_id: record?.dimension_unit_id ?? "",

  // Weight
  gross_weight: record?.gross_weight ?? "",
  net_weight: record?.net_weight ?? "",
  weight_unit_id: record?.weight_unit_id ?? "",

  // Custom Fields
  custom_fields: record?.custom_fields ?? [],

  // Pricing
  buying_price: record?.buying_price ?? "",
  selling_price: record?.selling_price ?? "",
  landed_cost: record?.landed_cost ?? "",
  tax_rate: record?.tax_rate ?? "",

  // Reorder Levels
  reordering_point: String(record?.reordering_point ?? "2"),
  overstock_point: String(record?.overstock_point ?? "5"),
  warehouseReorder: record?.warehouseReorder ?? [
    {
      warehouse_id: "",
      reordering_point: "2",
      overstock_point: "5",
    },
  ],

  // Stock
  strick_stock_control: Number(record?.strick_stock_control ?? 0),
  initial_stock: record?.initial_stock ?? "0",
  tracking_method: record?.tracking_method ?? "none",
  warehouseStock: record?.warehouseStock ?? [
    {
      warehouse_id: "",
      stock: "0",
    },
  ],

  // Ledgers
  purchase_ledger_id: record?.purchase_ledger_id ?? "",
  sale_ledger_id: record?.sale_ledger_id ?? "",
  inventory_ledger_id: record?.inventory_ledger_id ?? "",
});
