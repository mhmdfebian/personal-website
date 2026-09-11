"use client";

import { useActionState } from "react";

export type TaxonomyActionState = { error?: string };
type TaxonomyFormProps = { kind: "category" | "tag"; action: (state: TaxonomyActionState, formData: FormData) => Promise<TaxonomyActionState>; submitLabel: string; item?: { id: number; name: string; slug: string; description?: string } };

export function TaxonomyForm({ kind, action, submitLabel, item }: TaxonomyFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  return <form action={formAction} className="max-w-2xl space-y-6">{item ? <input name="id" type="hidden" value={item.id} /> : null}<label className="block text-sm font-medium">Name<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={item?.name} name="name" required /></label><label className="block text-sm font-medium">Slug<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={item?.slug} name="slug" required /></label>{kind === "category" ? <label className="block text-sm font-medium">Description<textarea className="mt-2 min-h-32 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={item?.description} name="description" /></label> : null}{state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}<button className="bg-black px-5 py-3 font-medium text-white disabled:opacity-50" disabled={pending} type="submit">{pending ? "Saving..." : submitLabel}</button></form>;
}