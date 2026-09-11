"use server";

import { revalidatePath } from "next/cache";

import { archiveMessage, deleteMessage, markMessageAsRead } from "@/lib/api/messages";
import { requireAdmin } from "@/lib/auth/session";

function idFrom(formData: FormData) {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function markMessageReadAction(formData: FormData) {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id || !(await markMessageAsRead(id))) throw new Error("Message not found.");
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
}

export async function archiveMessageAction(formData: FormData) {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id || !(await archiveMessage(id))) throw new Error("Message not found.");
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id || !(await deleteMessage(id))) throw new Error("Message not found.");
  revalidatePath("/admin/messages");
}