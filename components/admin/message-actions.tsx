"use client";

import { archiveMessageAction, deleteMessageAction, markMessageReadAction } from "@/app/admin/(protected)/messages/actions";

export function MessageActions({ id, status }: { id: number; status: string }) {
  return <div className="flex flex-wrap gap-2 text-sm"><form action={markMessageReadAction}><input name="id" type="hidden" value={id} /><button className="border border-black/20 px-3 py-2" disabled={status === "read"} type="submit">Mark as read</button></form><form action={archiveMessageAction}><input name="id" type="hidden" value={id} /><button className="border border-black/20 px-3 py-2" disabled={status === "archived"} type="submit">Archive</button></form><form action={deleteMessageAction} onSubmit={(event) => { if (!window.confirm("Delete this message permanently?")) event.preventDefault(); }}><input name="id" type="hidden" value={id} /><button className="border border-red-200 px-3 py-2 text-red-700" type="submit">Delete</button></form></div>;
}