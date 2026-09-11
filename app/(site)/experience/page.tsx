import { getPublishedExperience } from "@/lib/api/experience";
import { formatDateRange } from "@/lib/formatters/date";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Experience",
  description: "A timeline of professional experience and selected roles.",
};

export default async function ExperiencePage() {
  const experiences = await getPublishedExperience();

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <header className="mb-14 max-w-2xl"><p className="mb-3 text-sm uppercase tracking-[0.2em] text-black/50">Career</p><h1 className="text-5xl font-semibold tracking-tight">Experience</h1><p className="mt-5 text-lg leading-8 text-black/65">A record of the teams, products, and problems that shaped my work.</p></header>
      {experiences.length === 0 ? <div className="border border-dashed border-black/20 px-6 py-12 text-black/60">No published experience yet.</div> : <ol className="relative border-l border-black/15">{experiences.map((experience) => <li className="relative pl-8 pb-12 last:pb-0" key={experience.id}><span aria-hidden="true" className="absolute -left-[5px] top-1 h-2 w-2 bg-black" /><article><div className="flex flex-wrap items-baseline justify-between gap-3"><h2 className="text-2xl font-semibold tracking-tight">{experience.role}</h2><time className="text-sm text-black/55" dateTime={experience.startDate}>{formatDateRange(experience.startDate, experience.endDate, experience.isCurrent)}</time></div><p className="mt-2 font-medium">{experience.company}{experience.location ? <span className="font-normal text-black/55"> · {experience.location}</span> : null}{experience.isCurrent ? <span className="ml-3 border border-black/20 px-2 py-1 text-xs uppercase tracking-wide">Current</span> : null}</p><p className="mt-5 whitespace-pre-wrap leading-8 text-black/70">{experience.summary}</p><div className="mt-5 flex flex-wrap gap-2 text-xs text-black/55">{experience.technologies.map((technology) => <span className="border border-black/15 px-2 py-1" key={technology}>{technology}</span>)}</div></article></li>)}</ol>}
    </section>
  );
}