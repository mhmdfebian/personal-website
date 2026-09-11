import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { media, projects } from "@/lib/db/schema";

async function publicProjects(where: ReturnType<typeof eq> | ReturnType<typeof and>) {
  const rows = await db.select({ project: projects, media: { url: media.url, alt: media.alt, width: media.width, height: media.height } }).from(projects).leftJoin(media, eq(media.id, projects.mediaId)).where(where).orderBy(desc(projects.updatedAt));
  return rows.map(({ project, media: projectMedia }) => ({ ...project, imageUrl: projectMedia?.url ?? project.imageUrl, imageAlt: projectMedia?.alt ?? project.title, imageWidth: projectMedia?.width ?? null, imageHeight: projectMedia?.height ?? null }));
}

export async function getFeaturedProjects() {
  return publicProjects(and(eq(projects.isFeatured, true), eq(projects.isPublished, true)));
}

export async function getPublishedProjects() {
  return publicProjects(eq(projects.isPublished, true));
}

export async function getPublishedProjectBySlug(slug: string) {
  const result = await db
    .select({ project: projects, media: { url: media.url, alt: media.alt, width: media.width, height: media.height } })
    .from(projects)
    .leftJoin(media, eq(media.id, projects.mediaId))
    .where(and(eq(projects.slug, slug), eq(projects.isPublished, true)))
    .limit(1);

  const item = result[0];
  return item ? { ...item.project, imageUrl: item.media?.url ?? item.project.imageUrl, imageAlt: item.media?.alt ?? item.project.title, imageWidth: item.media?.width ?? null, imageHeight: item.media?.height ?? null } : undefined;
}