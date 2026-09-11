import { z } from "zod";

import { normalizeSlug } from "@/lib/validation/slug";

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  slug: z.string().trim().transform(normalizeSlug).pipe(z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  description: z.string().trim(),
});

export const tagInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  slug: z.string().trim().transform(normalizeSlug).pipe(z.string().min(1, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type TagInput = z.infer<typeof tagInputSchema>;

export function taxonomyInputFromFormData(formData: FormData, kind: "category" | "tag") {
  const input = {
    name: typeof formData.get("name") === "string" ? formData.get("name") : "",
    slug: typeof formData.get("slug") === "string" ? formData.get("slug") : "",
    description: typeof formData.get("description") === "string" ? formData.get("description") : "",
  };

  return kind === "category" ? categoryInputSchema.safeParse(input) : tagInputSchema.safeParse(input);
}