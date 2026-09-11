"use client";

import { useActionState } from "react";

import type { ExperienceActionState } from "@/app/admin/(protected)/experience/actions";

type ExperienceFormProps = {
  action: (state: ExperienceActionState, formData: FormData) => Promise<ExperienceActionState>;
  submitLabel: string;
  experience?: {
    id: number;
    company: string;
    role: string;
    summary: string;
    location: string | null;
    technologies: string[];
    displayOrder: number;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    isPublished: boolean;
  };
};

export function ExperienceForm({ action, submitLabel, experience }: ExperienceFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {experience ? <input name="id" type="hidden" value={experience.id} /> : null}
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block text-sm font-medium">Company<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.company} name="company" required /></label>
        <label className="block text-sm font-medium">Position<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.role} name="role" required /></label>
        <label className="block text-sm font-medium">Location<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.location ?? ""} name="location" /></label>
        <label className="block text-sm font-medium">Display order<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.displayOrder ?? 0} min="0" name="displayOrder" required type="number" /></label>
        <label className="block text-sm font-medium">Start date<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.startDate} name="startDate" required type="date" /></label>
        <label className="block text-sm font-medium">End date<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.endDate ?? ""} name="endDate" type="date" /></label>
      </div>
      <label className="block text-sm font-medium">Description<textarea className="mt-2 min-h-40 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.summary} name="summary" required /></label>
      <label className="block text-sm font-medium">Technologies<input className="mt-2 w-full border border-black/20 px-3 py-2 font-normal" defaultValue={experience?.technologies.join(", ")} name="technologies" placeholder="TypeScript, PostgreSQL" /></label>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm"><input defaultChecked={experience?.isCurrent} name="isCurrent" type="checkbox" />Current position</label>
        <label className="flex items-center gap-2 text-sm"><input defaultChecked={experience?.isPublished} name="isPublished" type="checkbox" />Published</label>
      </div>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button className="bg-black px-5 py-3 font-medium text-white disabled:opacity-50" disabled={pending} type="submit">{pending ? "Saving..." : submitLabel}</button>
    </form>
  );
}