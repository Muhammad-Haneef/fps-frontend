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
  item: z.coerce.string().min(1, "Please select an item"),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional().default(""),
  selling_price: z.coerce.number().min(0, "Price cannot be negative"),
  qty: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  qty_unit_id: z.coerce.string().optional().default(1),
  warehouse: z.coerce.string().optional().default(""),
  tax_rate: z.coerce.number().min(0).max(100, "Tax rate must be between 0 and 100").default(0),
  images: z.array(z.any()).optional().default([]),
  show_description: z.boolean().optional().default(false),
  show_images: z.boolean().optional().default(false),
  collapsed: z.boolean().optional().default(false),
});

const groupItemSchema = z.object({
  item: z.coerce.string().min(1, "Please select an item"),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional().default(""),
  selling_price: z.coerce.number().min(0, "Price cannot be negative"),
  qty: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  qty_unit_id: z.coerce.string().optional().default(1),
  warehouse: z.coerce.string().optional().default(""),
  images: z.array(z.any()).optional().default([]),
  show_description: z.boolean().optional().default(false),
  show_images: z.boolean().optional().default(false),
  collapsed: z.boolean().optional().default(false),
});

const groupSchema = z.object({
  title: z.string().min(1, "Group title is required"),
  items: z.array(groupItemSchema).min(1, "Add at least one item to the group"),
  images: z.array(z.any()).optional().default([]),
  show_images: z.boolean().optional().default(false),
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
    quotation_number: z.string().min(1, "Quotation number is required"),
    date: z.coerce.date({ required_error: "Quotation date is required" }),
    due_date: z.coerce.date().optional().nullable(),
    reminder_days: z.coerce.number().optional().default(3),
    custom_fields: z.array(customFieldSchema).optional().default([]),

    // Business & Company
    business: z.any().optional().nullable(),
    business_id: z.coerce.string().min(1, "Please select a business"),
    company: z.any().optional().nullable(),
    company_id: z.coerce.string().min(1, "Please select a company"),

    // Shipping
    shipping_enabled: z.boolean().optional().default(false),
    shipping_address: z.string().optional().default(""),

    // Currency & Tax
    currency: z.string().min(1, "Currency is required"),
    number_format: z.string().optional().default("1,234.00"),

    // Items — at least one line item OR one group is required
    items: z.array(lineItemSchema).optional().default([]),
    groups: z.array(groupSchema).optional().default([]),

    // Summary Calculations
    overall_discount_type: z.enum(["percentage", "fixed"]).default("percentage"),
    overall_discount_value: z.coerce.number().min(0, "Discount cannot be negative").default(0),
    additional_charges: z.array(chargeSchema).optional().default([]),
    round_mode: z.enum(["none", "up", "down"]).default("none"),
    signature: z.any().optional().nullable(),

    // Contact Details
    contact_details: z
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
    additional_notes: z.string().optional().default(""),
    additional_info: z.array(customFieldSchema).optional().default([]),

    // Advanced Options
    advanced_options: z.object({
      display_unit: z.boolean().default(true),
      merge_quantity: z.boolean().default(false),
      show_tax_summary: z.boolean().default(true),
      hide_country: z.boolean().default(false),
      hide_original_images: z.boolean().default(false),
      show_thumbnails: z.boolean().default(true),
      show_full_description: z.boolean().default(false),
      hide_group_subtotal: z.boolean().default(false),
      show_sku: z.boolean().default(true),
      show_serial_number: z.boolean().default(false),
      display_batch_details: z.boolean().default(false),
      show_item_images: z.boolean().default(true),
    }),
  })
  .refine((data) => (data.items?.length || 0) + (data.groups?.length || 0) > 0, {
    message: "Add at least one line item or group before saving",
    path: ["items"],
  });
