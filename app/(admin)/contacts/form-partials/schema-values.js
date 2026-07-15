import { z } from "zod";

export const Schema = z.object({
  id: z.number().default(0),

  // Only required field
  image: z.any().nullable().default(null),
  name: z.string().min(1, { message: "Please Enter Name" }),

  // General Information
  company_id: z.string().default(""),
  email: z
    .string()
    .email("Please enter a valid email")
    .or(z.literal(""))
    .default(""),
  phone: z.string().default(""),
  mobile: z.string().default(""),

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
  display_name: z.string().default(""),
  department: z.string().default(""),
  job_title: z.string().default(""),
  source_id: z.string().default(""),

  // Social
  linkedin_url: z.string().default(""),
  facebook_url: z.string().default(""),
  twitter_url: z.string().default(""),
  instagram_url: z.string().default(""),
  youtube_url: z.string().default(""),
  tiktok_url: z.string().default(""),

  // Status
  sort_by: z.string().default("0"),
  is_active: z.coerce.number().default("1"),
});

export const FormValues = (record = {}) => ({
  id: record?.id ?? 0,

  // General Information
  image: null,
  image_url: record?.image ?? "",

  name: record?.name ?? "",
  company_id: String(record?.company_id ?? ""),
  email: record?.email ?? "",
  phone: record?.phone ?? "",
  mobile: record?.mobile ?? "",
  tax_number: record?.tax_number ?? "",

  // Address
  address: record?.address ?? "",
  country_id: String(record?.country_id ?? ""),
  state_id: String(record?.state_id ?? ""),
  city_id: String(record?.city_id ?? ""),
  postal_code: record?.postal_code ?? "",
  map_link: record?.map_link ?? "",

  // Details
  description: record?.description ?? "",
  notes: record?.notes ?? "",
  display_name: record?.display_name ?? "",
  department: record?.department ?? "",
  job_title: record?.job_title ?? "",
  source_id: String(record?.source_id ?? ""),

  // Social
  linkedin_url: record?.linkedin_url ?? "",
  facebook_url: record?.facebook_url ?? "",
  twitter_url: record?.twitter_url ?? "",
  instagram_url: record?.instagram_url ?? "",
  youtube_url: record?.youtube_url ?? "",
  tiktok_url: record?.tiktok_url ?? "",

  // Status
  is_active: record?.is_active ?? true,
  sort_by: String(record?.sort_by ?? "0"),
});
