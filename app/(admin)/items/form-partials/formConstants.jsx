import { Lock } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Static option lists (replace with real API data)                   */
/* ------------------------------------------------------------------ */

export const CURRENCY_OPTIONS = [
  { label: "Pakistani Rupee (PKR, PKRs)", value: "PKR" },
  { label: "US Dollar (USD, $)", value: "USD" },
  { label: "UAE Dirham (AED, د.إ)", value: "AED" },
  { label: "Saudi Riyal (SAR, ر.س)", value: "SAR" },
];

export const TRACKING_METHOD_OPTIONS = [
  { title: "None", id: "none" },
  { title: "Batchwise", id: "batchwise", disabled: true, icon: <Lock className="h-3 w-3 text-muted-foreground" /> },
  { title: "Serial No.", id: "serial", disabled: true, icon: <Lock className="h-3 w-3 text-muted-foreground" /> },
  { title: "Batch + Serial No.", id: "batch-serial", disabled: true, icon: <Lock className="h-3 w-3 text-muted-foreground" /> },
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
