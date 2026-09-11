import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { saveTagAction } from "../actions";

export default function NewTagPage() { return <section><h1 className="mb-8 text-4xl font-semibold">New tag</h1><TaxonomyForm action={saveTagAction} kind="tag" submitLabel="Create tag" /></section>; }