import { eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { media, posts, projects, seoMetadata } from "@/lib/db/schema";
import type { ContentSeoInput, GlobalSeoInput } from "@/lib/validation/seo";

export const GLOBAL_SEO_KEY = "global";

async function withOgImage(id: number) {
  const result = await db.select({ seo: seoMetadata, ogImage: media }).from(seoMetadata).leftJoin(media, eq(media.id, seoMetadata.defaultOgImageMediaId)).where(eq(seoMetadata.id, id)).limit(1);
  return result[0] ? { ...result[0].seo, ogImage: result[0].ogImage } : undefined;
}

export async function getGlobalSeo() {
  const result = await db.select({ id: seoMetadata.id }).from(seoMetadata).where(eq(seoMetadata.globalKey, GLOBAL_SEO_KEY)).limit(1);
  return result[0] ? withOgImage(result[0].id) : undefined;
}

export async function getProjectSeo(projectId: number) {
  const result = await db.select({ seoId: projects.seoMetadataId }).from(projects).where(eq(projects.id, projectId)).limit(1);
  return result[0]?.seoId ? withOgImage(result[0].seoId) : undefined;
}

export async function getPostSeo(postId: number) {
  const result = await db.select({ seoId: posts.seoMetadataId }).from(posts).where(eq(posts.id, postId)).limit(1);
  return result[0]?.seoId ? withOgImage(result[0].seoId) : undefined;
}

async function validateOgImage(mediaId: number | null) {
  if (!mediaId) return;
  const result = await db.select({ id: media.id }).from(media).where(eq(media.id, mediaId)).limit(1);
  if (!result[0]) throw new Error("OG image media was not found.");
}

export async function upsertGlobalSeo(input: GlobalSeoInput) {
  await requireAdmin();
  await validateOgImage(input.defaultOgImageMediaId);
  const existing = await db.select({ id: seoMetadata.id }).from(seoMetadata).where(eq(seoMetadata.globalKey, GLOBAL_SEO_KEY)).limit(1);
  const values = { ...input, globalKey: GLOBAL_SEO_KEY, robotsIndex: input.defaultRobots === "index,follow", robotsFollow: input.defaultRobots === "index,follow" };
  if (existing[0]) return db.update(seoMetadata).set({ ...values, updatedAt: new Date() }).where(eq(seoMetadata.id, existing[0].id)).returning();
  return db.insert(seoMetadata).values(values).returning();
}

async function upsertContentSeo(owner: "project" | "post", ownerId: number, input: ContentSeoInput) {
  await requireAdmin();
  await validateOgImage(input.ogImageMediaId);
  const table = owner === "project" ? projects : posts;
  const existingOwner = await db.select({ seoMetadataId: table.seoMetadataId }).from(table).where(eq(table.id, ownerId)).limit(1);
  if (!existingOwner[0]) throw new Error(`${owner} was not found.`);
  const values = { metaTitle: input.metaTitle || null, metaDescription: input.metaDescription || null, ogTitle: input.ogTitle || null, ogDescription: input.ogDescription || null, canonicalUrl: input.canonicalUrl || null, robotsIndex: !input.noIndex, robotsFollow: !input.noFollow, defaultOgImageMediaId: input.ogImageMediaId };
  let seoId = existingOwner[0].seoMetadataId;
  if (seoId) await db.update(seoMetadata).set({ ...values, updatedAt: new Date() }).where(eq(seoMetadata.id, seoId));
  else { const created = await db.insert(seoMetadata).values(values).returning({ id: seoMetadata.id }); seoId = created[0].id; await db.update(table).set({ seoMetadataId: seoId }).where(eq(table.id, ownerId)); }
  return seoId;
}

export function upsertProjectSeo(projectId: number, input: ContentSeoInput) { return upsertContentSeo("project", projectId, input); }
export function upsertPostSeo(postId: number, input: ContentSeoInput) { return upsertContentSeo("post", postId, input); }