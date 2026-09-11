import { z } from "zod";

import { normalizeSlug } from "@/lib/validation/slug";

const imageUrl = z.string().trim().url().refine((value) => value.startsWith("https://") || value.startsWith("http://"), "Image URL must use http:// or https://.");

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().transform(normalizeSlug).pipe(z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  excerpt: z.string().trim().min(1, "Excerpt is required."),
  content: z.string().trim().min(1, "Content is required."),
  coverImageUrl: imageUrl.optional().or(z.literal("")),
  mediaId: z.number().int().positive().nullable(),
  categoryId: z.number().int().positive("Category is required."),
  tagIds: z.array(z.number().int().positive()).max(50),
  status: z.enum(["draft", "published"]),
  publishedAt: z.date().nullable(),
}).superRefine((value, context) => {
  if (value.status === "published" && !value.publishedAt) {
    context.addIssue({ code: "custom", path: ["publishedAt"], message: "Published posts require a publication date." });
  }
});

export type PostInput = z.infer<typeof postInputSchema>;

export function postInputFromFormData(formData: FormData) {
  const publishedAtValue = typeof formData.get("publishedAt") === "string" ? formData.get("publishedAt") as string : "";
  const categoryId = Number(formData.get("categoryId"));
  const tagIds = formData.getAll("tagIds").map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0);

  return postInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl"),
    mediaId: formData.get("mediaId") ? Number(formData.get("mediaId")) : null,
    categoryId,
    tagIds: [...new Set(tagIds)],
    status: formData.get("status"),
    publishedAt: publishedAtValue ? new Date(publishedAtValue) : null,
  });
}