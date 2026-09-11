"use client";

import { deleteProjectAction, toggleFeaturedAction, togglePublishedAction } from "@/app/admin/(protected)/projects/actions";

export function ProjectRowActions({ id, isFeatured, isPublished }: { id: number; isFeatured: boolean; isPublished: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <a className="border border-black/20 px-2 py-1" href={`/admin/projects/${id}/edit`}>Edit</a>
      <form action={togglePublishedAction}>
        <input name="id" type="hidden" value={id} />
        <input name="isPublished" type="hidden" value={String(isPublished)} />
        <button className="border border-black/20 px-2 py-1" type="submit">{isPublished ? "Unpublish" : "Publish"}</button>
      </form>
      <form action={toggleFeaturedAction}>
        <input name="id" type="hidden" value={id} />
        <input name="isFeatured" type="hidden" value={String(isFeatured)} />
        <button className="border border-black/20 px-2 py-1" type="submit">{isFeatured ? "Unfeature" : "Feature"}</button>
      </form>
      <form action={deleteProjectAction} onSubmit={(event) => {
        if (!window.confirm("Delete this project permanently?")) event.preventDefault();
      }}>
        <input name="id" type="hidden" value={id} />
        <button className="border border-red-200 px-2 py-1 text-red-700" type="submit">Delete</button>
      </form>
    </div>
  );
}