import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { saveCategoryAction } from "../actions";

export default function NewCategoryPage() { return <section><h1 className="mb-8 text-4xl font-semibold">New category</h1><TaxonomyForm action={saveCategoryAction} kind="category" submitLabel="Create category" /></section>; }