import { notFound } from "next/navigation";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { getAdminCategoryById } from "@/lib/api/categories";
import { saveCategoryAction } from "../../actions";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) { const id = Number((await params).id); if (!Number.isInteger(id) || id < 1) notFound(); const item = await getAdminCategoryById(id); if (!item) notFound(); return <section><h1 className="mb-8 text-4xl font-semibold">Edit category</h1><TaxonomyForm action={saveCategoryAction} item={item} kind="category" submitLabel="Save changes" /></section>; }