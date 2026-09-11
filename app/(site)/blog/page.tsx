import Image from "next/image";
import Link from "next/link";

import { getCategories } from "@/lib/api/categories";
import { getPublishedPosts } from "@/lib/api/posts";
import { getReadingTime } from "@/lib/formatters/reading-time";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog", description: "Notes, ideas, and practical writing." };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; tag?: string; page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const [posts, categories] = await Promise.all([getPublishedPosts({ search: params.search, categorySlug: params.category, tagSlug: params.tag, page }), getCategories()]);
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.tag) query.set("tag", params.tag);

  return <section className="mx-auto w-full max-w-6xl px-6 py-20"><header className="mb-12 max-w-2xl"><p className="mb-3 text-sm uppercase tracking-[0.2em] text-black/50">Writing</p><h1 className="text-5xl font-semibold tracking-tight">Blog</h1><p className="mt-5 text-lg leading-8 text-black/65">Notes on building products, systems, and a thoughtful practice.</p></header><form className="mb-10 grid gap-3 md:grid-cols-[1fr_220px_auto]"><input className="border border-black/20 px-3 py-2" defaultValue={params.search} name="search" placeholder="Search posts" /><select className="border border-black/20 px-3 py-2" defaultValue={params.category ?? ""} name="category"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</select><button className="border border-black/20 px-4 py-2" type="submit">Filter</button></form>{posts.length === 0 ? <div className="border border-dashed border-black/20 px-6 py-12 text-black/60">No published posts match these filters.</div> : <div className="grid gap-8 md:grid-cols-2">{posts.map((post) => <article key={post.id}>{post.mediaUrl ? <Link href={`/blog/${post.slug}`}><div className="relative mb-5 aspect-[16/9] overflow-hidden bg-zinc-100"><Image alt={post.mediaAlt} className="object-cover" fill src={post.mediaUrl} unoptimized /></div></Link> : null}<p className="text-sm text-black/50">{post.category?.name ?? "Uncategorized"} · {post.publishedAt?.toLocaleDateString()} · {getReadingTime(post.excerpt)} min read</p><h2 className="mt-2 text-2xl font-semibold tracking-tight"><Link className="hover:opacity-60" href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="mt-3 leading-7 text-black/65">{post.excerpt}</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-black/55">{post.tags.map((tag) => <Link className="border border-black/15 px-2 py-1" href={`/blog/tag/${tag.slug}`} key={tag.id}>{tag.name}</Link>)}</div></article>)}</div>}<div className="mt-10 flex gap-3 text-sm">{page > 1 ? <Link className="border border-black/20 px-3 py-2" href={`/blog?${query.toString()}&page=${page - 1}`}>Previous</Link> : null}{posts.length === 10 ? <Link className="border border-black/20 px-3 py-2" href={`/blog?${query.toString()}&page=${page + 1}`}>Next</Link> : null}</div></section>;
}