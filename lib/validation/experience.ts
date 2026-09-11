import { z } from "zod";

const dateValue = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.").refine(
  (value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)),
  "Enter a valid date.",
);

export const experienceInputSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required."),
    role: z.string().trim().min(1, "Position is required."),
    location: z.string().trim(),
    summary: z.string().trim().min(1, "Description is required."),
    startDate: dateValue,
    endDate: dateValue.nullable(),
    isCurrent: z.boolean(),
    isPublished: z.boolean(),
    technologies: z.array(z.string().trim().min(1)).max(30),
    displayOrder: z.number().int().min(0, "Display order must be zero or greater."),
  })
  .superRefine((value, context) => {
    if (value.isCurrent && value.endDate !== null) {
      context.addIssue({ code: "custom", path: ["endDate"], message: "Current experience cannot have an end date." });
    }

    if (value.endDate && value.endDate < value.startDate) {
      context.addIssue({ code: "custom", path: ["endDate"], message: "End date cannot be before start date." });
    }
  });

export type ExperienceInput = z.infer<typeof experienceInputSchema>;

function formString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function experienceInputFromFormData(formData: FormData) {
  const endDate = formString(formData, "endDate");

  return experienceInputSchema.safeParse({
    company: formString(formData, "company"),
    role: formString(formData, "role"),
    location: formString(formData, "location"),
    summary: formString(formData, "summary"),
    startDate: formString(formData, "startDate"),
    endDate: endDate || null,
    isCurrent: formData.get("isCurrent") === "on",
    isPublished: formData.get("isPublished") === "on",
    technologies: formString(formData, "technologies")
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean),
    displayOrder: Number(formString(formData, "displayOrder")),
  });
}