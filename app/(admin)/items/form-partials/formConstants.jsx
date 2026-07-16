import { Lock } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Static option lists (replace with real API data)                   */
/* ------------------------------------------------------------------ */

export const CATEGORY_OPTIONS = [
  { label: "Raw Materials", value: "raw-materials" },
  { label: "Finished Goods", value: "finished-goods" },
  { label: "Packaging", value: "packaging" },
  { label: "Electronics", value: "electronics" },
  { label: "Apparel", value: "apparel" },
];

export const UNIT_OPTIONS = [
  { label: "Pieces (Pcs)", value: "pcs" },
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Litre (L)", value: "l" },
  { label: "Box", value: "box" },
  { label: "Dozen", value: "dozen" },
  { label: "Meter (m)", value: "m" },
];

export const LEDGER_OPTIONS = [
  { label: "Cost of Goods Sold", value: "cogs" },
  { label: "Direct Expenses", value: "direct-expenses" },
  { label: "Sales Revenue", value: "sales-revenue" },
  { label: "Inventory Asset", value: "inventory-asset" },
];

export const CURRENCY_OPTIONS = [
  { label: "Pakistani Rupee (PKR, PKRs)", value: "PKR" },
  { label: "US Dollar (USD, $)", value: "USD" },
  { label: "UAE Dirham (AED, د.إ)", value: "AED" },
  { label: "Saudi Riyal (SAR, ر.س)", value: "SAR" },
];

export const WAREHOUSE_OPTIONS = [
  { label: "Main Warehouse - Karachi", value: "wh-khi" },
  { label: "North Warehouse - Lahore", value: "wh-lhr" },
  { label: "Retail Store - Islamabad", value: "wh-isb" },
];

export const TRACKING_METHOD_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Batchwise", value: "batchwise", disabled: true, icon: <Lock className="h-3 w-3 text-muted-foreground" /> },
  { label: "Serial No.", value: "serial", disabled: true, icon: <Lock className="h-3 w-3 text-muted-foreground" /> },
  { label: "Batch + Serial No.", value: "batch-serial", disabled: true, icon: <Lock className="h-3 w-3 text-muted-foreground" /> },
];

export const DECIMAL_OPTIONS = [
  { label: "0 (1234)", value: "0" },
  { label: "2 (1234.00)", value: "2" },
  { label: "3 (1234.000)", value: "3" },
];

export const SEPARATOR_OPTIONS = [
  { label: "Comma (1,234.00)", value: "comma" },
  { label: "Space (1 234.00)", value: "space" },
  { label: "None (1234.00)", value: "none" },
];

export const SYMBOL_POSITION_OPTIONS = [
  { label: "Before amount (Rs. 1,234)", value: "before" },
  { label: "After amount (1,234 Rs.)", value: "after" },
];
