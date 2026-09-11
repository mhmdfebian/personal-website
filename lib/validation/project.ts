import { z } from "zod";

const httpUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith("https://") || value.startsWith("http://"), {
    message: "URL must use http:// or https://.",
  });

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .transform((value) => value.replace(/\s+/g, "-"))
  .pipe(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."));

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug,
  summary: z.string().trim().min(1, "Description is required."),
  content: z.string().trim().min(1, "Content is required."),
  imageUrl: httpUrl.optional().or(z.literal("")),
  mediaId: z.number().int().positive().nullable(),
  repositoryUrl: httpUrl.optional().or(z.literal("")),
  projectUrl: httpUrl.optional().or(z.literal("")),
  technologies: z.array(z.string().trim().min(1)).max(30),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.date().nullable(),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

function formString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function formBoolean(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function projectInputFromFormData(formData: FormData) {
  const publishedAtValue = formString(formData, "publishedAt");

  return projectInputSchema.safeParse({
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    summary: formString(formData, "summary"),
    content: formString(formData, "content"),
    imageUrl: formString(formData, "imageUrl"),
    mediaId: formData.get("mediaId") ? Number(formData.get("mediaId")) : null,
    repositoryUrl: formString(formData, "repositoryUrl"),
    projectUrl: formString(formData, "projectUrl"),
    technologies: formString(formData, "technologies")
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean),
    isFeatured: formBoolean(formData, "isFeatured"),
    isPublished: formBoolean(formData, "isPublished"),
    publishedAt: publishedAtValue ? new Date(publishedAtValue) : null,
  });
}