"use client";

import { useActionState } from "react";

import { uploadMediaAction, type MediaActionState } from "@/app/admin/(protected)/media/actions";

export function MediaUploadForm({ maxSizeMb }: { maxSizeMb: number }) {
  const [state, formAction, pending] = useActionState(uploadMediaAction, {} as MediaActionState);
  return <form action={formAction} encType="multipart/form-data" className="border border-black/10 bg-white p-6"><div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"><label className="block text-sm font-medium">Image<input accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm" name="file" required type="file" /></label><label className="block text-sm font-medium">Alt text<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" name="alt" placeholder="Describe the image" /></label><label className="block text-sm font-medium">Caption<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" name="caption" /></label></div><p className="mt-3 text-xs text-black/50">JPEG, PNG, and WebP up to {maxSizeMb} MB.</p>{state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}{state.success ? <p className="mt-3 text-sm text-green-700">{state.success}</p> : null}<button className="mt-5 bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={pending} type="submit">{pending ? "Uploading..." : "Upload image"}</button></form>;
}