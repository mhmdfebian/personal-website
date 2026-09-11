"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createPost, deletePost, publishPost, unpublishPost, updatePost } from "@/lib/api/posts";
import { requireAdmin } from "@/lib/auth/session";
import { postInputFromFormData } from "@/lib/validation/post";
import { contentSeoInputFromFormData } from "@/lib/validation/seo";
import { upsertPostSeo } from "@/lib/api/seo";

export type PostActionState = { error?: string };
function idFrom(formData: FormData) { const id = Number(formData.get("id")); return Number.isInteger(id) && id > 0 ? id : null; }
function errorMessage(error: unknown) { return error instanceof Error && error.message.includes("posts_slug_idx") ? "That slug is already in use." : error instanceof Error && (error.message === "Category not found." || error.message === "Media not found." || error.message.includes("tags were not found")) ? error.message : "The post could not be saved."; }

export async function savePostAction(_: PostActionState, formData: FormData): Promise<PostActionState> {
  await requireAdmin(); const parsed = postInputFromFormData(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid post." };
  try { const id = idFrom(formData); const postId = id ? (await updatePost(id, parsed.data))?.id : (await createPost(parsed.data))?.id; if (!postId) return { error: "Post not found." }; const seo = contentSeoInputFromFormData(formData); if (!seo.success) return { error: seo.error.issues[0]?.message ?? "Invalid SEO data." }; await upsertPostSeo(postId, seo.data); } catch (error) { return { error: errorMessage(error) }; }
  revalidatePath("/blog"); revalidatePath("/admin/blog"); redirect("/admin/blog");
}

export async function deletePostAction(formData: FormData) { await requireAdmin(); const id = idFrom(formData); if (!id) throw new Error("Invalid post ID."); if (!(await deletePost(id))) throw new Error("Post not found."); revalidatePath("/blog"); revalidatePath("/admin/blog"); }
export async function publishPostAction(formData: FormData) { await requireAdmin(); const id = idFrom(formData); if (!id) throw new Error("Invalid post ID."); if (!(await publishPost(id))) throw new Error("Post not found."); revalidatePath("/blog"); revalidatePath("/admin/blog"); }
export async function unpublishPostAction(formData: FormData) { await requireAdmin(); const id = idFrom(formData); if (!id) throw new Error("Invalid post ID."); if (!(await unpublishPost(id))) throw new Error("Post not found."); revalidatePath("/blog"); revalidatePath("/admin/blog"); }