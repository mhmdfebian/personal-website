import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogPostJsonLd } from "@/components/blog/blog-post-json-ld";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { getGlobalSeo, getPostSeo } from "@/lib/api/seo";
import { getPublishedPostBySlug } from "@/lib/api/posts";
import { getReadingTime } from "@/lib/formatters/reading-time";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
type BlogPostProps = { params: Promise<{ slug: string }> };

async function getPost(params: BlogPostProps["params"]) {
  const post = await getPublishedPostBySlug((await params).slug);
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await getPost(params);
  const [global, content] = await Promise.all([getGlobalSeo(), getPostSeo(post.id)]);
  return buildMetadata({ global, content, fallbackTitle: post.title, fallbackDescription: post.excerpt, fallbackImage: post.mediaUrl ? { url: post.mediaUrl, alt: post.mediaAlt } : null, path: `/blog/${post.slug}` });
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const post = await getPost(params);
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20">
      <BlogPostJsonLd dateModified={post.updatedAt.toISOString()} datePublished={post.publishedAt?.toISOString()} description={post.excerpt} image={post.mediaUrl} title={post.title} url={`/blog/${post.slug}`} />
      <Link className="text-sm text-black/60 underline underline-offset-4" href="/blog">← Back to blog</Link>
      <header className="mt-10 border-b border-black/10 pb-10">
        <p className="mb-4 text-sm text-black/50">{post.category ? <Link href={`/blog/category/${post.category.slug}`}>{post.category.name}</Link> : "Uncategorized"} · {post.publishedAt?.toLocaleDateString()} · {getReadingTime(post.content)} min read</p>
        <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">{post.title}</h1>
        <p className="mt-6 text-xl leading-8 text-black/65">{post.excerpt}</p>
      </header>
      {post.mediaUrl ? <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-zinc-100"><Image alt={post.mediaAlt} className="object-cover" fill src={post.mediaUrl} unoptimized /></div> : null}
      <div className="mt-10"><MarkdownContent content={post.content} /></div>
      <div className="mt-10 flex flex-wrap gap-2 text-sm">{post.tags.map((tag) => <Link className="border border-black/15 px-2 py-1" href={`/blog/tag/${tag.slug}`} key={tag.id}>{tag.name}</Link>)}</div>
    </article>
  );
}