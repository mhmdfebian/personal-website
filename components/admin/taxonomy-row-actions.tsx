"use client";

export function TaxonomyRowActions({ id, editHref, action, label }: { id: number; editHref: string; action: (formData: FormData) => Promise<void>; label: string }) {
  return <div className="flex gap-2 text-xs"><a className="border border-black/20 px-2 py-1" href={editHref}>Edit</a><form action={action} onSubmit={(event) => { if (!window.confirm(`Delete this ${label}?`)) event.preventDefault(); }}><input name="id" type="hidden" value={id} /><button className="border border-red-200 px-2 py-1 text-red-700" type="submit">Delete</button></form></div>;
}