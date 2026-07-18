/**
 * Quotation Utility Functions
 * Handles calculations, formatting, and conversions
 */

// Number to words conversion (supports up to billions)
const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

function convertHundreds(num) {
  let result = "";
  
  if (num > 99) {
    result += ones[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  
  if (num > 19) {
    result += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  } else if (num > 9) {
    result += teens[num - 10] + " ";
    return result.trim();
  }
  
  if (num > 0) {
    result += ones[num] + " ";
  }
  
  return result.trim();
}

export function numberToWords(amount, currency = "Rupees") {
  if (amount === 0) return "Zero " + currency + " Only";
  
  const isNegative = amount < 0;
  amount = Math.abs(amount);
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = amount.toFixed(2).split(".");
  const num = parseInt(integerPart);
  
  if (num === 0) {
    const paisaWords = convertHundreds(parseInt(decimalPart));
    return paisaWords ? paisaWords + " Paisa Only" : "Zero " + currency + " Only";
  }
  
  let words = "";
  
  // Billions
  if (num >= 1000000000) {
    words += convertHundreds(Math.floor(num / 1000000000)) + " Billion ";
  }
  
  // Millions
  if (num >= 1000000) {
    words += convertHundreds(Math.floor((num % 1000000000) / 1000000)) + " Million ";
  }
  
  // Thousands
  if (num >= 1000) {
    words += convertHundreds(Math.floor((num % 1000000) / 1000)) + " Thousand ";
  }
  
  // Hundreds
  if (num > 0) {
    words += convertHundreds(num % 1000);
  }
  
  words = words.trim() + " " + currency;
  
  // Add paisa/cents if present
  if (decimalPart && parseInt(decimalPart) > 0) {
    const paisaWords = convertHundreds(parseInt(decimalPart));
    words += " and " + paisaWords + " Paisa";
  }
  
  return (isNegative ? "Minus " : "") + words + " Only";
}

// Calculate line item amount
export function calculateLineAmount({ quantity = 0, rate = 0 }) {
  return parseFloat((quantity * rate).toFixed(2));
}

// Calculate discount amount
export function calculateDiscount({ amount = 0, discountType = "percentage", discountValue = 0 }) {
  if (discountType === "percentage") {
    return parseFloat((amount * discountValue / 100).toFixed(2));
  }
  return parseFloat(discountValue);
}

// Calculate tax amount
export function calculateTax({ amount = 0, taxRate = 0 }) {
  return parseFloat((amount * taxRate / 100).toFixed(2));
}

// Calculate item total (with discount and tax)
export function calculateItemTotal({ 
  quantity = 0, 
  rate = 0, 
  discountType = "percentage", 
  discountValue = 0, 
  taxRate = 0 
}) {
  const lineAmount = calculateLineAmount({ quantity, rate });
  const discountAmount = calculateDiscount({ amount: lineAmount, discountType, discountValue });
  const amountAfterDiscount = lineAmount - discountAmount;
  const taxAmount = calculateTax({ amount: amountAfterDiscount, taxRate });
  
  return {
    lineAmount: parseFloat(lineAmount.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    amountAfterDiscount: parseFloat(amountAfterDiscount.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat((amountAfterDiscount + taxAmount).toFixed(2))
  };
}

// Calculate subtotal from all items
export function calculateSubtotal(items = []) {
  return items.reduce((sum, item) => {
    if (item.type === "group") return sum;
    const lineAmount = calculateLineAmount({ 
      quantity: item.quantity || 0, 
      rate: item.rate || 0 
    });
    const discountAmount = calculateDiscount({
      amount: lineAmount,
      discountType: item.discountType || "percentage",
      discountValue: item.discountValue || 0
    });
    return sum + (lineAmount - discountAmount);
  }, 0);
}

// Calculate total tax from all items
export function calculateTotalTax(items = []) {
  return items.reduce((sum, item) => {
    if (item.type === "group") return sum;
    const lineAmount = calculateLineAmount({ 
      quantity: item.quantity || 0, 
      rate: item.rate || 0 
    });
    const discountAmount = calculateDiscount({
      amount: lineAmount,
      discountType: item.discountType || "percentage",
      discountValue: item.discountValue || 0
    });
    const amountAfterDiscount = lineAmount - discountAmount;
    const taxAmount = calculateTax({ 
      amount: amountAfterDiscount, 
      taxRate: item.taxRate || 0 
    });
    return sum + taxAmount;
  }, 0);
}

// Calculate grand total
export function calculateGrandTotal({
  items = [],
  overallDiscountType = "percentage",
  overallDiscountValue = 0,
  additionalCharges = [],
  roundMode = "none", // "none", "up", "down"
}) {
  const subtotal = calculateSubtotal(items);
  const totalTax = calculateTotalTax(items);
  
  // Calculate overall discount
  const overallDiscount = calculateDiscount({
    amount: subtotal,
    discountType: overallDiscountType,
    discountValue: overallDiscountValue
  });
  
  // Calculate additional charges total
  const chargesTotal = additionalCharges.reduce((sum, charge) => {
    return sum + (parseFloat(charge.amount) || 0);
  }, 0);
  
  let grandTotal = subtotal + totalTax - overallDiscount + chargesTotal;
  
  // Apply rounding
  if (roundMode === "up") {
    grandTotal = Math.ceil(grandTotal);
  } else if (roundMode === "down") {
    grandTotal = Math.floor(grandTotal);
  }
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    overallDiscount: parseFloat(overallDiscount.toFixed(2)),
    chargesTotal: parseFloat(chargesTotal.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
    roundingDifference: parseFloat((grandTotal - (subtotal + totalTax - overallDiscount + chargesTotal)).toFixed(2))
  };
}

// Format currency
export function formatCurrency(amount, currency = "PKR", locale = "en-PK") {
  const currencySymbols = {
    PKR: "Rs.",
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    AED: "AED"
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${symbol} ${parseFloat(amount).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format number based on format preference
export function formatNumber(number, format = "1,234.00") {
  const num = parseFloat(number);
  
  if (isNaN(num)) return "0.00";
  
  switch (format) {
    case "1,234.00":
      return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case "1.234,00":
      return num.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case "1234.00":
      return num.toFixed(2);
    default:
      return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

// Generate quotation number
export function generateQuotationNumber(prefix = "QT", year = new Date().getFullYear()) {
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${year}-${timestamp}`;
}

// Calculate group subtotal
export function calculateGroupSubtotal(items = [], groupId) {
  return items
    .filter(item => item.groupId === groupId && item.type !== "group")
    .reduce((sum, item) => {
      const totals = calculateItemTotal({
        quantity: item.quantity || 0,
        rate: item.rate || 0,
        discountType: item.discountType || "percentage",
        discountValue: item.discountValue || 0,
        taxRate: item.taxRate || 0
      });
      return sum + totals.total;
    }, 0);
}

// Calculate total quantity
export function calculateTotalQuantity(items = []) {
  return items.reduce((sum, item) => {
    if (item.type === "group") return sum;
    return sum + (parseFloat(item.quantity) || 0);
  }, 0);
}

// Validate quotation data
export function validateQuotation(data) {
  const errors = {};
  
  if (!data.quotationNumber) {
    errors.quotationNumber = "Quotation number is required";
  }
  
  if (!data.quotationDate) {
    errors.quotationDate = "Quotation date is required";
  }
  
  if (!data.client || !data.client.name) {
    errors.client = "Client is required";
  }
  
  if (!data.currency) {
    errors.currency = "Currency is required";
  }
  
  if (!data.items || data.items.length === 0) {
    errors.items = "At least one item is required";
  } else {
    const itemErrors = [];
    data.items.forEach((item, index) => {
      if (item.type === "group") return;
      
      const itemError = {};
      if (!item.name) itemError.name = "Item name is required";
      if (!item.quantity || item.quantity <= 0) itemError.quantity = "Quantity must be greater than 0";
      if (item.rate === undefined || item.rate < 0) itemError.rate = "Rate is required";
      
      if (Object.keys(itemError).length > 0) {
        itemErrors[index] = itemError;
      }
    });
    
    if (itemErrors.length > 0) {
      errors.itemErrors = itemErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Get previous quotation number helper
export function getPreviousQuotationNumber(currentNumber) {
  // Extract numeric part and decrement
  const parts = currentNumber.split("-");
  if (parts.length >= 3) {
    const numPart = parseInt(parts[parts.length - 1]);
    if (!isNaN(numPart) && numPart > 1) {
      parts[parts.length - 1] = String(numPart - 1).padStart(parts[parts.length - 1].length, "0");
      return parts.join("-");
    }
  }
  return null;
}
