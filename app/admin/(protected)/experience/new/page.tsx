import { ExperienceForm } from "@/components/admin/experience-form";

import { createExperienceAction } from "../actions";

export default function NewExperiencePage() {
  return <section className="max-w-4xl"><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 mb-8 text-4xl font-semibold tracking-tight">New experience</h1><ExperienceForm action={createExperienceAction} submitLabel="Create experience" /></section>;
}