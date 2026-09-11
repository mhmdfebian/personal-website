import { notFound } from "next/navigation";

import { MessageActions } from "@/components/admin/message-actions";
import { getAdminMessageById } from "@/lib/api/messages";

export default async function AdminMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const message = await getAdminMessageById(id);
  if (!message) notFound();
  return <article className="max-w-3xl"><p className="text-sm uppercase tracking-[0.2em] text-black/50">Message</p><h1 className="mt-2 text-4xl font-semibold">{message.subject}</h1><dl className="mt-8 grid gap-4 border-y border-black/10 py-6 text-sm md:grid-cols-2"><div><dt className="text-black/50">From</dt><dd className="mt-1 font-medium">{message.name}</dd></div><div><dt className="text-black/50">Email</dt><dd className="mt-1 font-medium">{message.email}</dd></div><div><dt className="text-black/50">Received</dt><dd className="mt-1">{message.createdAt.toLocaleString()}</dd></div><div><dt className="text-black/50">Status</dt><dd className="mt-1">{message.status}</dd></div></dl><div className="whitespace-pre-wrap border-b border-black/10 pb-8 leading-8">{message.message}</div><div className="mt-6"><MessageActions id={message.id} status={message.status} /></div></article>;
}