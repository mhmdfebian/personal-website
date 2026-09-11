import { ProjectForm } from "@/components/admin/project-form";
import { getAdminMedia } from "@/lib/api/media";

import { createProjectAction } from "../actions";

export default async function NewProjectPage() {
  const media = await getAdminMedia();
  return <section className="max-w-4xl"><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 mb-8 text-4xl font-semibold tracking-tight">New project</h1><ProjectForm action={createProjectAction} media={media} submitLabel="Create project" /></section>;
}