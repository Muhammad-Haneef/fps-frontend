import { z } from "zod";

export const Schema = z.object({
  id: z.number().default(0),

  // Only required field
  title: z.string().min(1, { message: "Please Enter Title" }),

  // General Information
  logo: z.any().nullable().default(null),
  industry_id: z.string().default(""),
  type_id: z.string().default(""),
  display_name: z.string().default(""),
  code: z.string().default(""),
  email: z
    .string()
    .email("Please enter a valid email")
    .or(z.literal(""))
    .default(""),
  phone: z.string().default(""),
  mobile: z.string().default(""),
  website: z.string().default(""),
  tax_number: z.string().default(""),

  // Address
  address: z.string().default(""),
  country_id: z.string().default(""),
  state_id: z.string().default(""),
  city_id: z.string().default(""),
  postal_code: z.string().default(""),
  map_link: z.string().default(""),

  // Details
  description: z.string().default(""),
  notes: z.string().default(""),
  ownership_id: z.string().default(""),
  company_size_id: z.string().default(""),
  source_id: z.string().default(""),
  annual_revenue: z.string().default(""),
  sort_by: z.string().default("0"),

  // Status
  is_active: z.coerce.number().default("1"),

  // Invoice
  default_due_days: z.string().default("0"),
  show_email_on_invoice: z.coerce.number().default(""),
  show_phone_on_invoice: z.coerce.number().default(""),
  show_address_on_invoice: z.coerce.number().default(""),
  invoice_notes: z.string().default(""),

  // Social
  linkedin_url: z.string().default(""),
  facebook_url: z.string().default(""),
  twitter_url: z.string().default(""),
  instagram_url: z.string().default(""),
  youtube_url: z.string().default(""),
  tiktok_url: z.string().default(""),

  // Account
  create_ledger: z.string().default("yes"),
  chart_of_account_id: z.string().default(""),
});

export const FormValues = (record = {}) => ({
  id: record?.id ?? 0,

  // General Information
  logo: null,
  logo_url: record?.logo ?? "",

  title: record?.title ?? "",
  industry_id: String(record?.industry_id ?? ""),
  type_id: String(record?.type_id ?? ""),
  display_name: record?.display_name ?? "",
  code: record?.code ?? "",
  email: record?.email ?? "",
  phone: record?.phone ?? "",
  mobile: record?.mobile ?? "",
  website: record?.website ?? "",
  tax_number: record?.tax_number ?? "",

  // Address
  address: String(record?.address ?? ""),
  country_id: String(record?.country_id ?? ""),
  state_id: String(record?.state_id ?? ""),
  city_id: String(record?.city_id ?? ""),
  postal_code: record?.postal_code ?? "",
  map_link: record?.map_link ?? "",

  // Details
  description: record?.description ?? "",
  notes: record?.notes ?? "",
  ownership_id: String(record?.ownership_id ?? ""),
  company_size_id: String(record?.company_size_id ?? ""),
  source_id: String(record?.source_id ?? ""),
  annual_revenue: record?.annual_revenue ?? "",
  
  // Status
  is_active: record?.is_active ?? true,
  sort_by: String(record?.sort_by ?? "0"),

  // Invoice
  default_due_days: String(record?.default_due_days ?? ""),
  show_email_on_invoice: record?.show_email_on_invoice ?? true,
  show_phone_on_invoice: record?.show_phone_on_invoice ?? true,
  show_address_on_invoice: record?.show_address_on_invoice ?? true,
  invoice_notes: record?.invoice_notes ?? "",

  // Social
  linkedin_url: record?.linkedin_url ?? "",
  facebook_url: record?.facebook_url ?? "",
  twitter_url: record?.twitter_url ?? "",
  instagram_url: record?.instagram_url ?? "",
  youtube_url: record?.youtube_url ?? "",
  tiktok_url: record?.tiktok_url ?? "",

  // Account
  create_ledger: record?.create_ledger ?? "yes",
  chart_of_account_id: record?.chart_of_account_id ?? "",
});
