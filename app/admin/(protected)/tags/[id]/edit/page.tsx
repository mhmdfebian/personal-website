import { notFound } from "next/navigation";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { getAdminTagById } from "@/lib/api/tags";
import { saveTagAction } from "../../actions";

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) { const id = Number((await params).id); if (!Number.isInteger(id) || id < 1) notFound(); const item = await getAdminTagById(id); if (!item) notFound(); return <section><h1 className="mb-8 text-4xl font-semibold">Edit tag</h1><TaxonomyForm action={saveTagAction} item={item} kind="tag" submitLabel="Save changes" /></section>; }