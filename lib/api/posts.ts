import { and, desc, eq, exists, ilike, inArray, sql } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { categories, media, postCategories, postTags, posts, projects, seoMetadata, tags } from "@/lib/db/schema";
import type { PostInput } from "@/lib/validation/post";

export type PostListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  status: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: { id: number; name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
  mediaUrl: string | null;
  mediaAlt: string;
};

type PostQueryOptions = {
  search?: string;
  slug?: string;
  categorySlug?: string;
  tagSlug?: string;
  page?: number;
  pageSize?: number;
};

type PostTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function getTagsForPosts(postIds: number[]) {
  if (postIds.length === 0) return new Map<number, { id: number; name: string; slug: string }[]>();
  const rows = await db
    .select({ postId: postTags.postId, id: tags.id, name: tags.name, slug: tags.slug })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(inArray(postTags.postId, postIds));
  const result = new Map<number, { id: number; name: string; slug: string }[]>();
  for (const row of rows) result.set(row.postId, [...(result.get(row.postId) ?? []), { id: row.id, name: row.name, slug: row.slug }]);
  return result;
}

async function listPosts(options: PostQueryOptions = {}, publicOnly = true) {
  const conditions = publicOnly ? [eq(posts.isPublished, true), eq(posts.status, "published")] : [];
  if (options.slug) conditions.push(eq(posts.slug, options.slug));
  if (options.search) conditions.push(ilike(posts.title, `%${options.search}%`));
  if (options.categorySlug) conditions.push(eq(categories.slug, options.categorySlug));
  if (options.tagSlug) {
    conditions.push(exists(db.select({ postId: postTags.postId }).from(postTags).innerJoin(tags, eq(tags.id, postTags.tagId)).where(and(eq(postTags.postId, posts.id), eq(tags.slug, options.tagSlug)))));
  }

  const pageSize = options.pageSize ?? 10;
  const page = Math.max(options.page ?? 1, 1);
  const rows = await db
    .select({ post: posts, category: { id: categories.id, name: categories.name, slug: categories.slug }, media: { url: media.url, alt: media.alt } })
    .from(posts)
    .leftJoin(postCategories, eq(postCategories.postId, posts.id))
    .leftJoin(categories, eq(categories.id, postCategories.categoryId))
    .leftJoin(media, eq(media.id, posts.mediaId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const tagMap = await getTagsForPosts(rows.map(({ post }) => post.id));
  return rows.map(({ post, category, media: postMedia }) => ({ ...post, category, tags: tagMap.get(post.id) ?? [], mediaUrl: postMedia?.url ?? post.coverImageUrl, mediaAlt: postMedia?.alt ?? post.title }));
}

export async function getPublishedPosts(options: PostQueryOptions = {}) {
  return listPosts(options, true);
}

export async function getPublishedPostBySlug(slug: string) {
  const result = await listPosts({ slug, pageSize: 1 }, true);
  return result[0];
}

export function getPublishedPostsByCategory(categorySlug: string, options: Omit<PostQueryOptions, "categorySlug"> = {}) {
  return getPublishedPosts({ ...options, categorySlug });
}

export function getPublishedPostsByTag(tagSlug: string, options: Omit<PostQueryOptions, "tagSlug"> = {}) {
  return getPublishedPosts({ ...options, tagSlug });
}

export async function getAdminPosts(options: PostQueryOptions & { status?: "draft" | "published" } = {}) {
  await requireAdmin();
  const conditions = options.status ? [eq(posts.status, options.status)] : [];
  if (options.slug) conditions.push(eq(posts.slug, options.slug));
  if (options.search) conditions.push(ilike(posts.title, `%${options.search}%`));
  if (options.categorySlug) conditions.push(eq(categories.slug, options.categorySlug));
  const pageSize = options.pageSize ?? 20;
  const page = Math.max(options.page ?? 1, 1);
  const rows = await db.select({ post: posts, category: { id: categories.id, name: categories.name, slug: categories.slug }, media: { url: media.url, alt: media.alt } }).from(posts).leftJoin(postCategories, eq(postCategories.postId, posts.id)).leftJoin(categories, eq(categories.id, postCategories.categoryId)).leftJoin(media, eq(media.id, posts.mediaId)).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(posts.updatedAt)).limit(pageSize).offset((page - 1) * pageSize);
  const tagMap = await getTagsForPosts(rows.map(({ post }) => post.id));
  return rows.map(({ post, category, media: postMedia }) => ({ ...post, category, tags: tagMap.get(post.id) ?? [], mediaUrl: postMedia?.url ?? post.coverImageUrl, mediaAlt: postMedia?.alt ?? post.title }));
}

export async function getAdminPostById(id: number) {
  await requireAdmin();
  const rows = await db.select({ post: posts, category: { id: categories.id, name: categories.name, slug: categories.slug }, media: { url: media.url, alt: media.alt } }).from(posts).leftJoin(postCategories, eq(postCategories.postId, posts.id)).leftJoin(categories, eq(categories.id, postCategories.categoryId)).leftJoin(media, eq(media.id, posts.mediaId)).where(eq(posts.id, id)).limit(1);
  const row = rows[0];
  if (!row) return undefined;
  const tagMap = await getTagsForPosts([id]);
  return { ...row.post, category: row.category, tags: tagMap.get(id) ?? [], mediaUrl: row.media?.url ?? row.post.coverImageUrl, mediaAlt: row.media?.alt ?? row.post.title };
}

async function validateRelations(transaction: PostTransaction, categoryId: number, tagIds: number[]) {
  const category = await transaction.select({ id: categories.id }).from(categories).where(eq(categories.id, categoryId)).limit(1);
  if (!category[0]) throw new Error("Category not found.");
  const uniqueTagIds = [...new Set(tagIds)];
  if (uniqueTagIds.length > 0) {
    const foundTags = await transaction.select({ id: tags.id }).from(tags).where(inArray(tags.id, uniqueTagIds));
    if (foundTags.length !== uniqueTagIds.length) throw new Error("One or more tags were not found.");
  }
}

async function validateMediaReference(transaction: PostTransaction, mediaId: number | null) {
  if (!mediaId) return;
  const result = await transaction.select({ id: media.id }).from(media).where(eq(media.id, mediaId)).limit(1);
  if (!result[0]) throw new Error("Media not found.");
}

async function syncRelations(transaction: PostTransaction, postId: number, categoryId: number, tagIds: number[]) {
  await transaction.delete(postCategories).where(eq(postCategories.postId, postId));
  await transaction.insert(postCategories).values({ postId, categoryId });
  await transaction.delete(postTags).where(eq(postTags.postId, postId));
  const uniqueTagIds = [...new Set(tagIds)];
  if (uniqueTagIds.length > 0) await transaction.insert(postTags).values(uniqueTagIds.map((tagId) => ({ postId, tagId })));
}

export async function createPost(input: PostInput) {
  await requireAdmin();
  return db.transaction(async (transaction) => {
    await validateRelations(transaction, input.categoryId, input.tagIds);
    await validateMediaReference(transaction, input.mediaId);
    const result = await transaction.insert(posts).values({ title: input.title, slug: input.slug, excerpt: input.excerpt, content: input.content, coverImageUrl: input.coverImageUrl || null, mediaId: input.mediaId, status: input.status, isPublished: input.status === "published", publishedAt: input.status === "published" ? input.publishedAt ?? new Date() : input.publishedAt }).returning({ id: posts.id });
    await syncRelations(transaction, result[0].id, input.categoryId, input.tagIds);
    return result[0];
  });
}

export async function updatePost(id: number, input: PostInput) {
  await requireAdmin();
  return db.transaction(async (transaction) => {
    await validateRelations(transaction, input.categoryId, input.tagIds);
    await validateMediaReference(transaction, input.mediaId);
    const result = await transaction.update(posts).set({ title: input.title, slug: input.slug, excerpt: input.excerpt, content: input.content, coverImageUrl: input.coverImageUrl || null, mediaId: input.mediaId, status: input.status, isPublished: input.status === "published", publishedAt: input.status === "published" ? input.publishedAt ?? new Date() : input.publishedAt, updatedAt: new Date() }).where(eq(posts.id, id)).returning({ id: posts.id });
    if (!result[0]) return undefined;
    await syncRelations(transaction, id, input.categoryId, input.tagIds);
    return result[0];
  });
}

export async function deletePost(id: number) {
  await requireAdmin();
  return db.transaction(async (transaction) => {
    const existing = await transaction.select({ seoMetadataId: posts.seoMetadataId }).from(posts).where(eq(posts.id, id)).limit(1);
    if (!existing[0]) return false;
    await transaction.delete(posts).where(eq(posts.id, id));
    if (existing[0].seoMetadataId) {
      const [postReference, projectReference] = await Promise.all([
        transaction.select({ id: posts.id }).from(posts).where(eq(posts.seoMetadataId, existing[0].seoMetadataId)).limit(1),
        transaction.select({ id: projects.id }).from(projects).where(eq(projects.seoMetadataId, existing[0].seoMetadataId)).limit(1),
      ]);
      if (postReference.length === 0 && projectReference.length === 0) await transaction.delete(seoMetadata).where(eq(seoMetadata.id, existing[0].seoMetadataId));
    }
    return true;
  });
}

export async function publishPost(id: number) {
  await requireAdmin();
  const result = await db.update(posts).set({ status: "published", isPublished: true, publishedAt: sql`coalesce(${posts.publishedAt}, now())`, updatedAt: new Date() }).where(eq(posts.id, id)).returning({ id: posts.id });
  return result[0];
}

export async function unpublishPost(id: number) {
  await requireAdmin();
  const result = await db.update(posts).set({ status: "draft", isPublished: false, updatedAt: new Date() }).where(eq(posts.id, id)).returning({ id: posts.id });
  return result[0];
}