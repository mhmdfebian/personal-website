import { notFound } from "next/navigation";

import { ExperienceForm } from "@/components/admin/experience-form";
import { getAdminExperienceById } from "@/lib/api/experience";

import { updateExperienceAction } from "../../actions";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) notFound();

  const experience = await getAdminExperienceById(id);
  if (!experience) notFound();

  return <section className="max-w-4xl"><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 mb-8 text-4xl font-semibold tracking-tight">Edit experience</h1><ExperienceForm action={updateExperienceAction} experience={experience} submitLabel="Save changes" /></section>;
}