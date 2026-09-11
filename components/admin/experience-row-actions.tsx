"use client";

import { deleteExperienceAction, toggleCurrentAction } from "@/app/admin/(protected)/experience/actions";

export function ExperienceRowActions({ id, isCurrent }: { id: number; isCurrent: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <a className="border border-black/20 px-2 py-1" href={`/admin/experience/${id}/edit`}>Edit</a>
      <form action={toggleCurrentAction}><input name="id" type="hidden" value={id} /><input name="isCurrent" type="hidden" value={String(isCurrent)} /><button className="border border-black/20 px-2 py-1" type="submit">{isCurrent ? "Unset current" : "Set current"}</button></form>
      <form action={deleteExperienceAction} onSubmit={(event) => { if (!window.confirm("Delete this experience permanently?")) event.preventDefault(); }}><input name="id" type="hidden" value={id} /><button className="border border-red-200 px-2 py-1 text-red-700" type="submit">Delete</button></form>
    </div>
  );
}