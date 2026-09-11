import { desc, eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";
import type { ContactMessageInput } from "@/lib/validation/contact";

export async function createContactMessage(input: ContactMessageInput) {
  const result = await db.insert(contactMessages).values(input).returning({ id: contactMessages.id });
  return result[0];
}

export async function getAdminMessages() {
  await requireAdmin();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getAdminMessageById(id: number) {
  await requireAdmin();
  const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
  return result[0];
}

export async function markMessageAsRead(id: number) {
  await requireAdmin();
  const result = await db.update(contactMessages).set({ status: "read", updatedAt: new Date() }).where(eq(contactMessages.id, id)).returning({ id: contactMessages.id });
  return result[0];
}

export async function archiveMessage(id: number) {
  await requireAdmin();
  const result = await db.update(contactMessages).set({ status: "archived", updatedAt: new Date() }).where(eq(contactMessages.id, id)).returning({ id: contactMessages.id });
  return result[0];
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning({ id: contactMessages.id });
  return result.length > 0;
}