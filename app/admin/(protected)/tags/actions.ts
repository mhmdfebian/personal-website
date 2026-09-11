"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createTag, deleteTag, updateTag } from "@/lib/api/tags";
import { requireAdmin } from "@/lib/auth/session";
import { taxonomyInputFromFormData } from "@/lib/validation/taxonomy";

export type TagActionState = { error?: string };
function idFrom(formData: FormData) { const id = Number(formData.get("id")); return Number.isInteger(id) && id > 0 ? id : null; }
function errorMessage(error: unknown) { return error instanceof Error && (error.message.includes("tags_slug_idx") || error.message.includes("tags_name_idx")) ? "That tag name or slug is already in use." : "The tag could not be saved."; }

export async function saveTagAction(_: TagActionState, formData: FormData): Promise<TagActionState> {
  await requireAdmin(); const parsed = taxonomyInputFromFormData(formData, "tag");
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid tag." };
  try { const id = idFrom(formData); if (id) { if (!(await updateTag(id, parsed.data))) return { error: "Tag not found." }; } else await createTag(parsed.data); } catch (error) { return { error: errorMessage(error) }; }
  revalidatePath("/admin/tags"); redirect("/admin/tags");
}

export async function deleteTagAction(formData: FormData) {
  await requireAdmin(); const id = idFrom(formData); if (!id) throw new Error("Invalid tag ID."); if (!(await deleteTag(id))) throw new Error("Tag not found."); revalidatePath("/admin/tags"); revalidatePath("/admin/blog");
}