import { asc, eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { postTags, posts, tags } from "@/lib/db/schema";
import type { TagInput } from "@/lib/validation/taxonomy";

export async function getTags() {
  return db.select().from(tags).orderBy(asc(tags.name));
}

export async function getPublishedTags() {
  return db
    .selectDistinct({ id: tags.id, name: tags.name, slug: tags.slug, createdAt: tags.createdAt, updatedAt: tags.updatedAt })
    .from(tags)
    .innerJoin(postTags, eq(postTags.tagId, tags.id))
    .innerJoin(posts, eq(posts.id, postTags.postId))
    .where(eq(posts.isPublished, true))
    .orderBy(asc(tags.name));
}

export async function getTagBySlug(slug: string) {
  const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return result[0];
}

export async function getAdminTags() {
  await requireAdmin();
  return getTags();
}

export async function getAdminTagById(id: number) {
  await requireAdmin();
  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return result[0];
}

export async function createTag(input: TagInput) {
  await requireAdmin();
  const result = await db.insert(tags).values(input).returning({ id: tags.id });
  return result[0];
}

export async function updateTag(id: number, input: TagInput) {
  await requireAdmin();
  const result = await db.update(tags).set({ ...input, updatedAt: new Date() }).where(eq(tags.id, id)).returning({ id: tags.id });
  return result[0];
}

export async function deleteTag(id: number) {
  await requireAdmin();
  const result = await db.delete(tags).where(eq(tags.id, id)).returning({ id: tags.id });
  return result.length > 0;
}