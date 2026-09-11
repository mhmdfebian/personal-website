"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createCategory, deleteCategory, updateCategory } from "@/lib/api/categories";
import { requireAdmin } from "@/lib/auth/session";
import { categoryInputSchema } from "@/lib/validation/taxonomy";

export type CategoryActionState = { error?: string };
function idFrom(formData: FormData) { const id = Number(formData.get("id")); return Number.isInteger(id) && id > 0 ? id : null; }
function errorMessage(error: unknown) { return error instanceof Error && (error.message.includes("categories_slug_idx") || error.message.includes("categories_name_idx")) ? "That category name or slug is already in use." : "The category could not be saved."; }

export async function saveCategoryAction(_: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  await requireAdmin();
  const parsed = categoryInputSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid category." };
  try { const id = idFrom(formData); if (id) { if (!(await updateCategory(id, parsed.data))) return { error: "Category not found." }; } else await createCategory(parsed.data); } catch (error) { return { error: errorMessage(error) }; }
  revalidatePath("/admin/categories"); redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin(); const id = idFrom(formData); if (!id) throw new Error("Invalid category ID.");
  const result = await deleteCategory(id); if (result.reason === "in_use") throw new Error("Category is used by a post and cannot be deleted."); if (!result.deleted) throw new Error("Category not found.");
  revalidatePath("/admin/categories"); revalidatePath("/admin/blog");
}