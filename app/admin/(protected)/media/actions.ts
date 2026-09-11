"use server";

import { revalidatePath } from "next/cache";

import { createMedia, deleteMedia, updateMediaMetadata } from "@/lib/api/media";
import { requireAdmin } from "@/lib/auth/session";

export type MediaActionState = { error?: string; success?: string };

function idFrom(formData: FormData) {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function uploadMediaAction(_: MediaActionState, formData: FormData): Promise<MediaActionState> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Choose an image to upload." };

  try {
    await createMedia(file, {
      alt: typeof formData.get("alt") === "string" ? formData.get("alt") as string : "",
      caption: typeof formData.get("caption") === "string" ? formData.get("caption") as string : "",
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The image could not be uploaded." };
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/blog");
  return { success: "Image uploaded." };
}

export async function updateMediaAction(_: MediaActionState, formData: FormData): Promise<MediaActionState> {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id) return { error: "Invalid media ID." };
  try {
    await updateMediaMetadata(id, {
      alt: typeof formData.get("alt") === "string" ? formData.get("alt") as string : "",
      caption: typeof formData.get("caption") === "string" ? formData.get("caption") as string : "",
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Metadata could not be saved." };
  }
  revalidatePath("/admin/media");
  return { success: "Metadata saved." };
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id) throw new Error("Invalid media ID.");
  const result = await deleteMedia(id);
  if (result.reason === "in_use") throw new Error("This image is still used by a project or blog post.");
  if (!result.deleted) throw new Error("Media not found.");
  revalidatePath("/admin/media");
}