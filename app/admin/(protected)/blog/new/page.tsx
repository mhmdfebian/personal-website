import { PostForm } from "@/components/admin/post-form";
import { getAdminCategories } from "@/lib/api/categories";
import { getAdminTags } from "@/lib/api/tags";
import { getAdminMedia } from "@/lib/api/media";
import { savePostAction } from "../actions";

export default async function NewPostPage() { const [categories, tags, media] = await Promise.all([getAdminCategories(), getAdminTags(), getAdminMedia()]); return <section className="max-w-4xl"><h1 className="mb-8 text-4xl font-semibold">New post</h1><PostForm action={savePostAction} categories={categories} media={media} tags={tags} submitLabel="Create post" /></section>; }