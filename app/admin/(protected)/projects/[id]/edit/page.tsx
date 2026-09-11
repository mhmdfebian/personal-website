import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/project-form";
import { getAdminProjectById } from "@/lib/api/admin/projects";
import { getAdminMedia } from "@/lib/api/media";
import { getProjectSeo } from "@/lib/api/seo";

import { updateProjectAction } from "../../actions";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const [project, media] = await Promise.all([getAdminProjectById(id), getAdminMedia()]);
  if (!project) notFound();
  const seo = await getProjectSeo(id);
  return <section className="max-w-4xl"><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 mb-8 text-4xl font-semibold tracking-tight">Edit project</h1><ProjectForm action={updateProjectAction} media={media} project={project} seo={seo} submitLabel="Save changes" /></section>;
}