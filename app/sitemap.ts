import type { MetadataRoute } from "next";

import { getPublishedCategories } from "@/lib/api/categories";
import { getPublishedPosts } from "@/lib/api/posts";
import { getPublishedProjects } from "@/lib/api/projects";
import { getPublishedTags } from "@/lib/api/tags";
import { getGlobalSeo } from "@/lib/api/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [global, projects, posts, categories, tags] = await Promise.all([getGlobalSeo(), getPublishedProjects(), getPublishedPosts({ pageSize: 1000 }), getPublishedCategories(), getPublishedTags()]);
  const baseUrl = global?.siteUrl ?? "http://localhost:3000";
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/experience`, lastModified: new Date() },
    ...projects.map((project) => ({ url: `${baseUrl}/projects/${project.slug}`, lastModified: project.updatedAt })),
    ...posts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.updatedAt })),
    ...categories.map((category) => ({ url: `${baseUrl}/blog/category/${category.slug}`, lastModified: category.updatedAt })),
    ...tags.map((tag) => ({ url: `${baseUrl}/blog/tag/${tag.slug}`, lastModified: tag.updatedAt })),
  ];
}