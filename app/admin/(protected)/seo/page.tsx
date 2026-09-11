import { GlobalSeoForm } from "@/components/admin/global-seo-form";
import { getAdminMedia } from "@/lib/api/media";
import { getGlobalSeo } from "@/lib/api/seo";


export default async function AdminSeoPage() {
  const [seo, media] = await Promise.all([getGlobalSeo(), getAdminMedia()]);
  return <section className="max-w-4xl"><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 text-4xl font-semibold">SEO</h1><p className="mt-3 text-black/60">Global defaults apply whenever content has no specific SEO override.</p><GlobalSeoForm media={media} seo={seo} /></section>;
}