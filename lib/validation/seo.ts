import { z } from "zod";

const optionalUrl = z.string().trim().url().or(z.literal(""));

export const globalSeoSchema = z.object({
  siteTitle: z.string().trim().min(1).max(120),
  siteDescription: z.string().trim().max(320),
  siteUrl: z.string().trim().url(),
  defaultOgImageMediaId: z.number().int().positive().nullable(),
  twitterCard: z.enum(["summary", "summary_large_image"]),
  defaultRobots: z.enum(["index,follow", "noindex,nofollow"]),
});

export const contentSeoSchema = z.object({
  metaTitle: z.string().trim().max(120),
  metaDescription: z.string().trim().max(320),
  canonicalUrl: optionalUrl,
  ogTitle: z.string().trim().max(120),
  ogDescription: z.string().trim().max(320),
  ogImageMediaId: z.number().int().positive().nullable(),
  noIndex: z.boolean(),
  noFollow: z.boolean(),
});

export type GlobalSeoInput = z.infer<typeof globalSeoSchema>;
export type ContentSeoInput = z.infer<typeof contentSeoSchema>;

export function contentSeoInputFromFormData(formData: FormData) {
  const numberOrNull = (name: string) => formData.get(name) ? Number(formData.get(name)) : null;
  return contentSeoSchema.safeParse({
    metaTitle: formData.get("seoTitle"),
    metaDescription: formData.get("seoDescription"),
    canonicalUrl: formData.get("canonicalUrl"),
    ogTitle: formData.get("ogTitle"),
    ogDescription: formData.get("ogDescription"),
    ogImageMediaId: numberOrNull("ogImageMediaId"),
    noIndex: formData.get("noIndex") === "on",
    noFollow: formData.get("noFollow") === "on",
  });
}