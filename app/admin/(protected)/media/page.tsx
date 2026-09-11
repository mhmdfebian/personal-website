import { MediaCard } from "@/components/admin/media-card";
import { MediaCopyHandler } from "@/components/admin/media-copy-handler";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { getAdminMedia } from "@/lib/api/media";
import { updateMediaAction } from "./actions";
import { deleteMediaAction } from "./actions";
import { MAX_UPLOAD_SIZE_MB } from "@/lib/validation/media";

export default async function AdminMediaPage() {
  const items = await getAdminMedia();
  return <section><div className="mb-8"><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 text-4xl font-semibold">Media Library</h1><p className="mt-3 text-black/60">Manage reusable images for projects and blog posts.</p></div><MediaUploadForm maxSizeMb={MAX_UPLOAD_SIZE_MB} /><div className="mt-10">{items.length === 0 ? <div className="border border-dashed border-black/20 px-6 py-12 text-black/60">No media uploaded yet.</div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <MediaCard action={updateMediaAction} deleteAction={deleteMediaAction} item={item} key={item.id} />)}</div>}</div><MediaCopyHandler /></section>;
}