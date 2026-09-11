"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getGlobalSeo, upsertGlobalSeo } from "@/lib/api/seo";
import { requireAdmin } from "@/lib/auth/session";
import { globalSeoSchema } from "@/lib/validation/seo";

export type GlobalSeoActionState = { error?: string };

export async function saveGlobalSeoAction(_: GlobalSeoActionState, formData: FormData): Promise<GlobalSeoActionState> {
  await requireAdmin();
  const parsed = globalSeoSchema.safeParse({
    siteTitle: formData.get("siteTitle"),
    siteDescription: formData.get("siteDescription"),
    siteUrl: formData.get("siteUrl"),
    defaultOgImageMediaId: formData.get("defaultOgImageMediaId") ? Number(formData.get("defaultOgImageMediaId")) : null,
    twitterCard: formData.get("twitterCard"),
    defaultRobots: formData.get("defaultRobots"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid global SEO data." };
  try { await upsertGlobalSeo(parsed.data); } catch (error) { return { error: error instanceof Error ? error.message : "Global SEO could not be saved." }; }
  revalidatePath("/", "layout");
  revalidatePath("/projects", "layout");
  revalidatePath("/blog", "layout");
  redirect("/admin/seo");
}

export async function getGlobalSeoForAdmin() { await requireAdmin(); return getGlobalSeo(); }