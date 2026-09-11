import Link from "next/link";

import { ExperienceRowActions } from "@/components/admin/experience-row-actions";
import { getAdminExperiences } from "@/lib/api/experience";
import { formatMonthYear } from "@/lib/formatters/date";

export default async function AdminExperiencePage() {
  const experiences = await getAdminExperiences();

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Experience</h1></div>
        <Link className="bg-black px-4 py-2 text-sm font-medium text-white" href="/admin/experience/new">New experience</Link>
      </div>
      {experiences.length === 0 ? (
        <div className="border border-dashed border-black/20 px-6 py-12 text-black/60">No experience records yet.</div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-black/10 bg-zinc-50 text-xs uppercase tracking-wide text-black/50"><tr><th className="px-4 py-3">Company</th><th className="px-4 py-3">Position</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Start date</th><th className="px-4 py-3">End date</th><th className="px-4 py-3">Current</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-black/10">{experiences.map((experience) => <tr key={experience.id}><td className="px-4 py-4 font-medium">{experience.company}</td><td className="px-4 py-4">{experience.role}</td><td className="px-4 py-4 text-black/60">{experience.location || "-"}</td><td className="px-4 py-4 text-black/60">{formatMonthYear(experience.startDate)}</td><td className="px-4 py-4 text-black/60">{experience.isCurrent ? "Present" : experience.endDate ? formatMonthYear(experience.endDate) : "-"}</td><td className="px-4 py-4">{experience.isCurrent ? "Yes" : "No"}</td><td className="px-4 py-4">{experience.displayOrder}</td><td className="px-4 py-4 text-black/60">{experience.updatedAt.toLocaleDateString()}</td><td className="px-4 py-4"><ExperienceRowActions id={experience.id} isCurrent={experience.isCurrent} /></td></tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}