import * as z from "zod";

/* ------------------------------------------------------------------ */
/* Validation schema                                                   */
/* ------------------------------------------------------------------ */

export const itemSchema = z.object({
  itemType: z.string().default("product"),
  category: z.string().optional(),
  sellableToCustomers: z.boolean().optional(),
  manageStock: z.boolean().optional(),
  itemImages: z.array(z.any()).optional(),
  itemOriginalImages: z.array(z.any()).optional(),
  itemName: z.string().min(2, "Item name must be at least 2 characters"),
  skuId: z.string().optional(),
  unit: z.string().optional(),

  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  vendorName: z.string().optional(),
  vendorCode: z.string().optional(),
  dimLength: z.string().optional(),
  dimWidth: z.string().optional(),
  dimHeight: z.string().optional(),
  weightValue: z.string().optional(),
  customFields: z
    .array(z.object({ key: z.string().optional(), value: z.string().optional() }))
    .optional(),

  purchaseLedger: z.string().optional(),
  salesLedger: z.string().optional(),
  inventoryLedger: z.string().optional(),

  currency: z.string().default("PKR"),
  currencyFormat: z
    .object({ decimalPlaces: z.string(), separator: z.string(), symbolPosition: z.string() })
    .optional(),
  buyingPrice: z.string().optional(),
  sellingPrice: z.string().optional(),
  landedCost: z.string().optional(),
  taxRate: z.string().optional(),
  priceInclusiveOfTaxes: z.boolean().optional(),

  strictControl: z.boolean().optional(),
  initialStock: z.string().optional(),
  trackingMethod: z.string().default("none"),
  warehouseStock: z
    .array(
      z.object({
        warehouse: z.string().min(1, "Warehouse is required"),
        stock: z.string().optional(),
      })
    )
    .optional(),

  reorderPoint: z.string().optional(),
  overstockPoint: z.string().optional(),
  warehouseReorder: z
    .array(
      z.object({
        warehouse: z.string().min(1, "Warehouse is required"),
        reorderPoint: z.string().optional(),
        overstockPoint: z.string().optional(),
      })
    )
    .optional(),
});

export const defaultValues = {
  itemType: "product",
  category: "",
  sellableToCustomers: false,
  manageStock: false,
  itemImages: [],
  itemOriginalImages: [],
  itemName: "",
  skuId: `${Date.now()}`,
  unit: "",

  description: "",
  tags: [],
  vendorName: "",
  vendorCode: "",
  dimLength: "",
  dimWidth: "",
  dimHeight: "",
  weightValue: "",
  customFields: [],

  purchaseLedger: "",
  salesLedger: "",
  inventoryLedger: "",

  currency: "PKR",
  currencyFormat: { decimalPlaces: "2", separator: "comma", symbolPosition: "before" },
  buyingPrice: "",
  sellingPrice: "",
  landedCost: "",
  taxRate: "",
  priceInclusiveOfTaxes: false,

  strictControl: false,
  initialStock: "",
  trackingMethod: "none",
  warehouseStock: [{ warehouse: "", stock: "0" }],

  reorderPoint: "2",
  overstockPoint: "5",
  warehouseReorder: [{ warehouse: "", reorderPoint: "2", overstockPoint: "5" }],
};
