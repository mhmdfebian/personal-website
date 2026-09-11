import type { MetadataRoute } from "next";

import { getGlobalSeo } from "@/lib/api/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const global = await getGlobalSeo();
  const baseUrl = global?.siteUrl ?? "http://localhost:3000";
  return { rules: { userAgent: "*", allow: "/", disallow: "/admin/" }, sitemap: `${baseUrl}/sitemap.xml` };
}