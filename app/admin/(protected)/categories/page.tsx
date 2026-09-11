import Link from "next/link";

import { TaxonomyRowActions } from "@/components/admin/taxonomy-row-actions";
import { getAdminCategories } from "@/lib/api/categories";
import { deleteCategoryAction } from "./actions";

export default async function AdminCategoriesPage() {
  const items = await getAdminCategories();
  return <section><div className="mb-8 flex items-end justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 text-4xl font-semibold">Categories</h1></div><Link className="bg-black px-4 py-2 text-sm font-medium text-white" href="/admin/categories/new">New category</Link></div>{items.length === 0 ? <div className="border border-dashed border-black/20 px-6 py-12 text-black/60">No categories yet.</div> : <div className="overflow-x-auto border border-black/10 bg-white"><table className="w-full text-left text-sm"><thead className="border-b border-black/10 bg-zinc-50 text-xs uppercase text-black/50"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Description</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-black/10">{items.map((item) => <tr key={item.id}><td className="px-4 py-4 font-medium">{item.name}</td><td className="px-4 py-4 text-black/60">{item.slug}</td><td className="px-4 py-4 text-black/60">{item.description || "-"}</td><td className="px-4 py-4"><TaxonomyRowActions action={deleteCategoryAction} editHref={`/admin/categories/${item.id}/edit`} id={item.id} label="category" /></td></tr>)}</tbody></table></div>}</section>;
}