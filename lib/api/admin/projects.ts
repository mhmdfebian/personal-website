import { eq, sql } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { media, posts, projects, seoMetadata } from "@/lib/db/schema";
import type { ProjectInput } from "@/lib/validation/project";

export async function getAdminProjects() {
  await requireAdmin();
  return db.select().from(projects);
}

export async function getAdminProjectById(id: number) {
  await requireAdmin();

  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function createProject(input: ProjectInput) {
  await requireAdmin();

  if (input.mediaId) {
    const mediaItem = await db.select({ id: media.id }).from(media).where(eq(media.id, input.mediaId)).limit(1);
    if (!mediaItem[0]) throw new Error("Media not found.");
  }

  const result = await db.insert(projects).values({
    ...input,
    imageUrl: input.imageUrl || null,
    mediaId: input.mediaId,
    repositoryUrl: input.repositoryUrl || null,
    projectUrl: input.projectUrl || null,
    publishedAt: input.isPublished ? input.publishedAt ?? new Date() : input.publishedAt,
  }).returning({ id: projects.id });

  return result[0];
}

export async function updateProject(id: number, input: ProjectInput) {
  await requireAdmin();

  if (input.mediaId) {
    const mediaItem = await db.select({ id: media.id }).from(media).where(eq(media.id, input.mediaId)).limit(1);
    if (!mediaItem[0]) throw new Error("Media not found.");
  }

  const result = await db
    .update(projects)
    .set({
      ...input,
      imageUrl: input.imageUrl || null,
      mediaId: input.mediaId,
      repositoryUrl: input.repositoryUrl || null,
      projectUrl: input.projectUrl || null,
      publishedAt: input.isPublished ? input.publishedAt ?? new Date() : input.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  return result[0];
}

export async function deleteProject(id: number) {
  await requireAdmin();

  return db.transaction(async (transaction) => {
    const result = await transaction
      .select({ seoMetadataId: projects.seoMetadataId })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    const project = result[0];
    if (!project) return false;

    await transaction.delete(projects).where(eq(projects.id, id));

    if (project.seoMetadataId) {
      const remainingReferences = await transaction
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.seoMetadataId, project.seoMetadataId))
        .limit(1);

      const remainingPostReferences = await transaction
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.seoMetadataId, project.seoMetadataId))
        .limit(1);

      if (remainingReferences.length === 0 && remainingPostReferences.length === 0) {
        await transaction.delete(seoMetadata).where(eq(seoMetadata.id, project.seoMetadataId));
      }
    }

    return true;
  });
}

export async function setProjectPublished(id: number, isPublished: boolean) {
  await requireAdmin();

  const result = await db
    .update(projects)
    .set({
      isPublished,
      publishedAt: isPublished ? sql`coalesce(${projects.publishedAt}, now())` : undefined,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  return result[0];
}

export async function setProjectFeatured(id: number, isFeatured: boolean) {
  await requireAdmin();

  const result = await db
    .update(projects)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  return result[0];
}