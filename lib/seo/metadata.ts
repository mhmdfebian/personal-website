import type { Metadata } from "next";

type SeoData = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  canonicalUrl?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogImage?: { url: string; alt: string } | null;
};

type GlobalData = SeoData & {
  siteTitle?: string | null;
  siteDescription?: string | null;
  siteUrl?: string | null;
  twitterCard?: string | null;
  defaultRobots?: string | null;
};

export function buildMetadata({ global, content, fallbackTitle, fallbackDescription, fallbackImage, path }: { global?: GlobalData; content?: SeoData; fallbackTitle: string; fallbackDescription: string; fallbackImage?: { url: string; alt: string } | null; path: string }): Metadata {
  const title = content?.metaTitle || fallbackTitle || global?.siteTitle || "Personal website";
  const description = content?.metaDescription || fallbackDescription || global?.siteDescription || "A personal portfolio, experience, and writing space.";
  const image = content?.ogImage?.url ? content.ogImage : fallbackImage?.url ? fallbackImage : global?.ogImage ?? null;
  const canonical = content?.canonicalUrl || (global?.siteUrl ? new URL(path, global.siteUrl).toString() : undefined);
  const noIndex = content?.robotsIndex === false || global?.defaultRobots === "noindex,nofollow";
  const noFollow = content?.robotsFollow === false || global?.defaultRobots === "noindex,nofollow";
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: { index: !noIndex, follow: !noFollow },
    openGraph: { title: content?.ogTitle || title, description: content?.ogDescription || description, url: canonical, images: image ? [{ url: image.url, alt: image.alt }] : undefined },
    twitter: { card: (global?.twitterCard as "summary" | "summary_large_image" | undefined) ?? "summary_large_image", title: content?.ogTitle || title, description: content?.ogDescription || description, images: image ? [image.url] : undefined },
  };
}