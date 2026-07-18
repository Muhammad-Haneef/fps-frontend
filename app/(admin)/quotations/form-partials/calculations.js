// lib/quotation-calculations.js
// Pure helper functions + domain constants shared by the Quotation Builder
// form sections. No React / no side-effects — safe to unit test directly.

/* ------------------------------------------------------------------ */
/* Domain option lists                                                 */
/* ------------------------------------------------------------------ */

export const CATEGORY_OPTIONS = [
  { id: "rep_repairing", title: "REP (Repairing)" },
  { id: "sale", title: "Sale" },
  { id: "service", title: "Service" },
];

export const STORE_OPTIONS = [
  { id: "spare_parts_store", title: "Spare Parts Store" },
  { id: "main_store", title: "Main Store" },
];

export const UNIT_OPTIONS = [
  { id: "product", title: "Product" },
  { id: "service", title: "Service" },
  { id: "hour", title: "Hour" },
  { id: "kg", title: "Kg" },
];

export const CLIENT_OPTIONS = [
  { id: "c1", title: "Al Rehman Traders" },
  { id: "c2", title: "Karachi Auto Spares" },
  { id: "c3", title: "Bilal Enterprises" },
];

export const CURRENCY_OPTIONS = [
  { id: "PKR", title: "Pakistani Rupee (PKR, Rs)" },
  { id: "USD", title: "US Dollar (USD, $)" },
  { id: "AED", title: "UAE Dirham (AED, د.إ)" },
];

export const CURRENCY_SYMBOLS = { PKR: "Rs ", USD: "$", AED: "AED " };

export const NUMBER_FORMAT_OPTIONS = [
  { id: "1,234.00", title: "1,234.00" },
  { id: "1.234,00", title: "1.234,00" },
  { id: "1 234.00", title: "1 234.00" },
];

export const ROUND_MODE_OPTIONS = [
  { title: "No rounding", id: "none" },
  { title: "Round up", id: "up" },
  { title: "Round down", id: "down" },
];

export const DISCOUNT_TYPE_OPTIONS = [
  { title: "Percentage", id: "percentage" },
  { title: "Fixed amount", id: "fixed" },
];

/* ------------------------------------------------------------------ */
/* Number → words                                                      */
/* ------------------------------------------------------------------ */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const SCALES = ["", "Thousand", "Million", "Billion", "Trillion"];

function threeDigitsToWords(n) {
  let str = "";
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + " ";
    n %= 10;
  }
  if (n > 0) str += ONES[n] + " ";
  return str.trim();
}

export function numberToWords(num) {
  num = Math.floor(Math.abs(num || 0));
  if (num === 0) return "Zero";
  const groups = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }
  let words = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    words += threeDigitsToWords(groups[i]) + (SCALES[i] ? " " + SCALES[i] : "") + " ";
  }
  return words.trim();
}

export function amountToWords(amount, currencyName = "Rupee", subunitName = "Paisa") {
  const whole = Math.floor(amount || 0);
  const fraction = Math.round(((amount || 0) - whole) * 100);
  let out = `${numberToWords(whole)} ${currencyName}`;
  if (fraction > 0) out += ` And ${numberToWords(fraction)} ${subunitName}`;
  return out + " Only";
}

/* ------------------------------------------------------------------ */
/* Money formatting                                                     */
/* ------------------------------------------------------------------ */

export function money(n, symbol = "Rs ") {
  const v = Number.isFinite(Number(n)) ? Number(n) : 0;
  return symbol + v.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ------------------------------------------------------------------ */
/* Line item math                                                       */
/* ------------------------------------------------------------------ */

/** amount = selling_price * qty, tax = amount * taxRate%, total = amount + tax */
export function lineTotals(row) {
  const selling_price = Number(row?.selling_price) || 0;
  const qty = Number(row?.qty) || 0;
  const amount = selling_price * qty;
  const tax = (amount * (Number(row?.taxRate) || 0)) / 100;
  return { amount, tax, total: amount + tax };
}

/** Sums an array of line-item-shaped rows (used for both `items` and each group's `items`). */
export function sumRows(rows = []) {
  return rows.reduce(
    (acc, row) => {
      const t = lineTotals(row);
      acc.amount += t.amount;
      acc.tax += t.tax;
      acc.qty += Number(row?.qty) || 0;
      return acc;
    },
    { amount: 0, tax: 0, qty: 0 }
  );
}

/**
 * Computes the full quotation summary given items, groups and the
 * discount / charges / rounding settings from the Summary sidebar.
 */
export function computeGrandTotals({
  items = [],
  groups = [],
  overallDiscountType = "percentage",
  overallDiscountValue = 0,
  additionalCharges = [],
  roundMode = "none",
}) {
  const itemsSum = sumRows(items);
  const groupsSum = groups.reduce(
    (acc, g) => {
      const s = sumRows(g?.items || []);
      acc.amount += s.amount;
      acc.tax += s.tax;
      acc.qty += s.qty;
      return acc;
    },
    { amount: 0, tax: 0, qty: 0 }
  );

  const amount = itemsSum.amount + groupsSum.amount;
  const tax = itemsSum.tax + groupsSum.tax;
  const qty = itemsSum.qty + groupsSum.qty;

  const discountValue = Number(overallDiscountValue) || 0;
  const discountAmount = overallDiscountType === "percentage" ? (amount * discountValue) / 100 : discountValue;

  const chargesTotal = (additionalCharges || []).reduce((sum, c) => sum + (Number(c?.amount) || 0), 0);

  let grand = amount + tax - discountAmount + chargesTotal;
  if (roundMode === "up") grand = Math.ceil(grand);
  if (roundMode === "down") grand = Math.floor(grand);

  return { amount, tax, qty, discountAmount, chargesTotal, grand };
}

/* ------------------------------------------------------------------ */
/* Factories — default shapes for new rows                             */
/* ------------------------------------------------------------------ */

export function makeLineItem() {
  return {
    name: "",
    description: "",
    selling_price: 0,
    qty: 1,
    taxRate: 0,
    category: "rep_repairing",
    subcategory: "spare_parts_store",
    images: [],
    showDescription: false,
    showImages: false,
    collapsed: false,
  };
}

export function makeGroupItem() {
  return {
    name: "",
    description: "",
    selling_price: 0,
    qty: 1,
    taxRate: 0,
    unit: "product",
    images: [],
    showDescription: false,
    showImages: false,
  };
}

export function makeGroup() {
  return {
    title: "This is group",
    items: [makeGroupItem()],
    images: [],
    showImages: false,
    collapsed: false,
  };
}

export function makeCustomField() {
  return { title: "", id: "" };
}

export function makeCharge() {
  return { title: "", amount: 0 };
}

export function makeTerm(text = "") {
  return { text };
}
