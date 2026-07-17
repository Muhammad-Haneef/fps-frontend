import { z } from "zod";

import { toNumberOrBlank } from "@/helper/ClientSide";

export const Schema = z.object({
  id: z.number().default(0),
  title: z
    .string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
  code: z
    .string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z0-9 _-]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
  contact: z.string().nullable().optional(),
  address: z.string(),
  postal_code: z.string().nullable().optional(),
  map_link: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),

  /*
  system_user_id: z.string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z0-9 _-]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
  country_id: z.string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z0-9 _-]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
  state_id: z.string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z0-9 _-]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
  city_id: z.string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z0-9 _-]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
    */

  system_user_id: z.number(),
  country_id: z.number(),
  state_id: z.number(),
  city_id: z.number(),
  sort_by: z.coerce.number().nullable().optional(),
  is_default: z.coerce.number().nullable().optional(),
  is_active: z.coerce.number().nullable().optional(),
});

export const FormValues = (record = {}) => ({
  id: record?.id ?? 0,
  title: record?.title ?? "",
  code: record?.code ?? "",

  system_user_id: record?.system_user_id ?? "",
  contact: record?.contact ?? "",
  address: record?.address ?? "",
  country_id: record?.country_id ?? "",
  state_id: record?.state_id ?? "",
  city_id: record?.city_id ?? "",
  postal_code: record?.postal_code ?? "",
  map_link: record?.map_link ?? "",
  dimensions: record?.dimensions ?? "",
  sort_by: String(record?.sort_by ?? "0"),
  is_default: String(record?.is_default ?? ""),
  is_active: String(record?.is_active ?? ""),
});
/*
export const Schema = z.object({
  id: z.number().default(0),

  title: z
    .string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
  code: z
    .string()
    .min(1, { message: "Please Enter Title" })
    .regex(/^[a-zA-Z0-9 _-]+$/, {
      message: "Only alphabets and spaces are allowed",
    }),
  system_user_id: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  country_id: z.string().nullable().optional(),
  state_id: z.string().nullable().optional(),
  city_id: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  map_link: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  sort_by: z.string().nullable().optional(),
  is_default: z.string().nullable().optional(),
  is_active: z.any().nullable().optional(),
});

export const FormValues = (record = {}) => ({
  id: record?.id ?? 0,

  title: record?.title ?? "",
  code: record?.code ?? "",

  system_user_id: record?.system_user_id ?? "",
  contact: record?.contact ?? "",
  address: record?.address ?? "",
  country_id: record?.country_id ?? "",
  state_id: record?.state_id ?? "",
  city_id: record?.city_id ?? "",
  postal_code: record?.postal_code ?? "",
  map_link: record?.map_link ?? "",
  dimensions: record?.dimensions ?? "",
  sort_by: record?.sort_by ?? null,
  is_default: record?.is_default ?? "",
  is_active: record?.is_active ?? "",
});
*/
