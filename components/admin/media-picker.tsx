"use client";

type MediaOption = { id: number; filename: string; url: string; width: number; height: number; alt: string };

export function MediaPicker({ media, name = "mediaId", selectedId }: { media: MediaOption[]; name?: string; selectedId?: number | null }) {
  return <label className="block text-sm font-medium">Media library<select className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={selectedId ?? ""} name={name}><option value="">No library image</option>{media.map((item) => <option key={item.id} value={item.id}>{item.filename} ({item.width}x{item.height})</option>)}</select><span className="mt-1 block text-xs font-normal text-black/50">Upload or manage images from the Media Library.</span></label>;
}