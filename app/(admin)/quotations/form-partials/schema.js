// lib/quotation-schema.js
import * as z from "zod";

/* ------------------------------------------------------------------ */
/* Reusable fragments                                                   */
/* ------------------------------------------------------------------ */

const customFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().optional().default(""),
});

const chargeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  amount: z.coerce.number().min(0, "Must be 0 or more"),
});

const termSchema = z.object({
  text: z.string().min(1, "Term cannot be empty"),
});

const lineItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional().default(""),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
  qty: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  taxRate: z.coerce.number().min(0).max(100, "Tax rate must be between 0 and 100").default(0),
  category: z.string().optional().default(""),
  subcategory: z.string().optional().default(""),
  images: z.array(z.any()).optional().default([]),
  showDescription: z.boolean().optional().default(false),
  showImages: z.boolean().optional().default(false),
  collapsed: z.boolean().optional().default(false),
});

const groupItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional().default(""),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
  qty: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  unit: z.string().optional().default("product"),
  images: z.array(z.any()).optional().default([]),
  showDescription: z.boolean().optional().default(false),
  showImages: z.boolean().optional().default(false),
});

const groupSchema = z.object({
  title: z.string().min(1, "Group title is required"),
  items: z.array(groupItemSchema).min(1, "Add at least one item to the group"),
  images: z.array(z.any()).optional().default([]),
  showImages: z.boolean().optional().default(false),
  collapsed: z.boolean().optional().default(false),
});

/* ------------------------------------------------------------------ */
/* Top level schema                                                     */
/* ------------------------------------------------------------------ */

export const quotationSchema = z
  .object({
    // Header
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional().default(""),
    logo: z.any().optional().nullable(),

    // Meta Information
    quotationNumber: z.string().min(1, "Quotation number is required"),
    quotationDate: z.coerce.date({ required_error: "Quotation date is required" }),
    dueDate: z.coerce.date().optional().nullable(),
    customFields: z.array(customFieldSchema).optional().default([]),

    // Company & Client
    company: z.object({
      name: z.string().min(1, "Business name is required"),
      address: z.string().optional().default(""),
      city: z.string().optional().default(""),
      country: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      email: z.string().email("Invalid email address").optional().or(z.literal("")),
      ntn: z.string().optional().default(""),
      gst: z.string().optional().default(""),
    }),
    client: z.any().optional().nullable(),
    clientId: z.string().min(1, "Please select a client"),

    // Shipping
    shippingEnabled: z.boolean().optional().default(false),
    shippingDetails: z
      .object({
        name: z.string().optional().default(""),
        phone: z.string().optional().default(""),
        address: z.string().optional().default(""),
        city: z.string().optional().default(""),
        state: z.string().optional().default(""),
        postalCode: z.string().optional().default(""),
        country: z.string().optional().default(""),
        notes: z.string().optional().default(""),
      })
      .optional(),

    // Currency & Tax
    currency: z.string().min(1, "Currency is required"),
    numberFormat: z.string().optional().default("1,234.00"),

    // Items — at least one line item OR one group is required
    items: z.array(lineItemSchema).optional().default([]),
    groups: z.array(groupSchema).optional().default([]),

    // Summary Calculations
    overallDiscountType: z.enum(["percentage", "fixed"]).default("percentage"),
    overallDiscountValue: z.coerce.number().min(0, "Discount cannot be negative").default(0),
    additionalCharges: z.array(chargeSchema).optional().default([]),
    roundMode: z.enum(["none", "up", "down"]).default("none"),
    signature: z.any().optional().nullable(),

    // Contact Details
    contactDetails: z
      .object({
        phone: z.string().optional().default(""),
        mobile: z.string().optional().default(""),
        email: z.string().email("Invalid email address").optional().or(z.literal("")),
        website: z.string().optional().default(""),
        address: z.string().optional().default(""),
      })
      .optional(),

    // Terms & Conditions
    terms: z.array(termSchema).optional().default([]),

    // Attachments
    attachments: z.array(z.any()).optional().default([]),

    // Additional Notes / Info
    additionalNotes: z.string().optional().default(""),
    additionalInfo: z.array(customFieldSchema).optional().default([]),

    // Advanced Options
    advancedOptions: z.object({
      displayUnit: z.boolean().default(true),
      mergeQuantity: z.boolean().default(false),
      showTaxSummary: z.boolean().default(true),
      hideCountry: z.boolean().default(false),
      hideOriginalImages: z.boolean().default(false),
      showThumbnails: z.boolean().default(true),
      showFullDescription: z.boolean().default(false),
      hideGroupSubtotal: z.boolean().default(false),
      showSKU: z.boolean().default(true),
      showSerialNumber: z.boolean().default(false),
      displayBatchDetails: z.boolean().default(false),
      showItemImages: z.boolean().default(true),
    }),
  })
  .refine((data) => (data.items?.length || 0) + (data.groups?.length || 0) > 0, {
    message: "Add at least one line item or group before saving",
    path: ["items"],
  });
