import { randomUUID } from "node:crypto";

import { imageSize } from "image-size";
import { desc, eq, or } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { media, posts, projects } from "@/lib/db/schema";
import { storage } from "@/lib/storage";
import { detectImageType, mediaMetadataSchema, mediaIdSchema, validateMediaFile } from "@/lib/validation/media";

export async function getAdminMedia() {
  await requireAdmin();
  return db.select().from(media).orderBy(desc(media.createdAt));
}

export async function getAdminMediaById(id: number) {
  await requireAdmin();
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0];
}

export async function getMediaById(id: number) {
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0];
}

export async function createMedia(file: File, metadata: { alt: string; caption: string }) {
  await requireAdmin();
  const fileError = validateMediaFile(file);
  if (fileError) throw new Error(fileError);
  const parsedMetadata = mediaMetadataSchema.safeParse(metadata);
  if (!parsedMetadata.success) throw new Error(parsedMetadata.error.issues[0]?.message ?? "Invalid media metadata.");

  const body = Buffer.from(await file.arrayBuffer());
  const detectedType = detectImageType(body);
  if (!detectedType || detectedType.mimeType !== file.type) throw new Error("The file contents do not match a supported image type.");

  const dimensions = imageSize(body);
  if (!dimensions.width || !dimensions.height) throw new Error("Could not read image dimensions.");

  const storageKey = `${randomUUID()}${detectedType.extension}`;
  const stored = await storage.upload({ key: storageKey, body, contentType: detectedType.mimeType });

  try {
    const result = await db.insert(media).values({
      filename: storageKey,
      originalFilename: file.name.replace(/[\\/]/g, "-").slice(0, 255),
      mimeType: detectedType.mimeType,
      size: file.size,
      storageKey: stored.key,
      url: stored.url,
      width: dimensions.width,
      height: dimensions.height,
      alt: parsedMetadata.data.alt,
      caption: parsedMetadata.data.caption,
    }).returning();
    return result[0];
  } catch (error) {
    await storage.delete(stored.key).catch(() => undefined);
    throw error;
  }
}

export async function updateMediaMetadata(id: number, metadata: { alt: string; caption: string }) {
  await requireAdmin();
  const parsed = mediaMetadataSchema.safeParse(metadata);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid media metadata.");
  const result = await db.update(media).set({ ...parsed.data, updatedAt: new Date() }).where(eq(media.id, id)).returning();
  return result[0];
}

export async function deleteMedia(id: number) {
  await requireAdmin();
  const parsedId = mediaIdSchema.safeParse(id);
  if (!parsedId.success) throw new Error("Invalid media ID.");

  const item = await db.select().from(media).where(eq(media.id, parsedId.data)).limit(1);
  if (!item[0]) return { deleted: false, reason: "not_found" as const };

  const references = await db.select({ projectId: projects.id, postId: posts.id })
    .from(projects)
    .fullJoin(posts, eq(posts.mediaId, projects.mediaId))
    .where(or(eq(projects.mediaId, parsedId.data), eq(posts.mediaId, parsedId.data)))
    .limit(1);
  if (references.length > 0) return { deleted: false, reason: "in_use" as const };

  await storage.delete(item[0].storageKey);
  const result = await db.delete(media).where(eq(media.id, parsedId.data)).returning({ id: media.id });
  return { deleted: result.length > 0, reason: result.length > 0 ? null : "not_found" as const };
}