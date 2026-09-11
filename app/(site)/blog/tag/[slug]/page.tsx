import Link from "next/link";
import { notFound } from "next/navigation";
import { getTagBySlug } from "@/lib/api/tags";
import { getPublishedPostsByTag } from "@/lib/api/posts";

export const dynamic = "force-dynamic";
export default async function BlogTagPage({ params }: { params: Promise<{ slug: string }> }) { const slug = (await params).slug; const tag = await getTagBySlug(slug); if (!tag) notFound(); const posts = await getPublishedPostsByTag(slug, { pageSize: 50 }); return <section className="mx-auto w-full max-w-5xl px-6 py-20"><p className="mb-3 text-sm uppercase tracking-[0.2em] text-black/50">Tag</p><h1 className="text-5xl font-semibold tracking-tight">{tag.name}</h1><div className="mt-12 space-y-6">{posts.map((post) => <article className="border-b border-black/10 pb-6" key={post.id}><p className="text-sm text-black/50">{post.publishedAt?.toLocaleDateString()}</p><h2 className="mt-2 text-2xl font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="mt-2 text-black/65">{post.excerpt}</p></article>)}{posts.length === 0 ? <p className="text-black/60">No published posts with this tag.</p> : null}</div></section>; }