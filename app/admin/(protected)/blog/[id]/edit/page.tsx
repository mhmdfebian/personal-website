import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { getAdminCategories } from "@/lib/api/categories";
import { getAdminPostById } from "@/lib/api/posts";
import { getAdminTags } from "@/lib/api/tags";
import { getAdminMedia } from "@/lib/api/media";
import { getPostSeo } from "@/lib/api/seo";
import { savePostAction } from "../../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) { const id = Number((await params).id); if (!Number.isInteger(id) || id < 1) notFound(); const [post, categories, tags, media] = await Promise.all([getAdminPostById(id), getAdminCategories(), getAdminTags(), getAdminMedia()]); if (!post) notFound(); const seo = await getPostSeo(id); return <section className="max-w-4xl"><h1 className="mb-8 text-4xl font-semibold">Edit post</h1><PostForm action={savePostAction} categories={categories} media={media} post={post} seo={seo} tags={tags} submitLabel="Save changes" /></section>; }