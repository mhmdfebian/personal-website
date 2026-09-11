import { asc, count, eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { categories, postCategories, posts } from "@/lib/db/schema";
import type { CategoryInput } from "@/lib/validation/taxonomy";

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function getPublishedCategories() {
  return db
    .selectDistinct({ id: categories.id, name: categories.name, slug: categories.slug, description: categories.description, createdAt: categories.createdAt, updatedAt: categories.updatedAt })
    .from(categories)
    .innerJoin(postCategories, eq(postCategories.categoryId, categories.id))
    .innerJoin(posts, eq(posts.id, postCategories.postId))
    .where(eq(posts.isPublished, true))
    .orderBy(asc(categories.name));
}

export async function getCategoryBySlug(slug: string) {
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function getAdminCategories() {
  await requireAdmin();
  return getCategories();
}

export async function getAdminCategoryById(id: number) {
  await requireAdmin();
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function createCategory(input: CategoryInput) {
  await requireAdmin();
  const result = await db.insert(categories).values(input).returning({ id: categories.id });
  return result[0];
}

export async function updateCategory(id: number, input: CategoryInput) {
  await requireAdmin();
  const result = await db.update(categories).set({ ...input, updatedAt: new Date() }).where(eq(categories.id, id)).returning({ id: categories.id });
  return result[0];
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  const references = await db.select({ total: count() }).from(postCategories).innerJoin(posts, eq(posts.id, postCategories.postId)).where(eq(postCategories.categoryId, id));
  if ((references[0]?.total ?? 0) > 0) return { deleted: false, reason: "in_use" as const };

  const result = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
  return { deleted: result.length > 0, reason: result.length > 0 ? null : "not_found" as const };
}