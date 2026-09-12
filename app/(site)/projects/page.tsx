import Link from "next/link";
import Image from "next/image";

import { getPublishedProjects } from "@/lib/api/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-black/50">
          Selected work
        </p>

        <h1 className="text-5xl font-semibold tracking-tight md:text-5xl">
          Projects
        </h1>

        <p className="mt-5 text-lg leading-8 text-black/65">
          A selection of products, experiments, and systems I have worked on.
        </p>
      </div>
      {projects.length === 0 ? (
        <div className="border border-dashed border-black/20 px-6 py-12 text-black/60">No published projects yet.</div>
      ) : (
        <div className="relative grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link className="rounded-2xl border border-black/10 p-6 transition-colors hover:bg-zinc-100" href={`/projects/${project.slug}`} key={project.id}>
              {project.imageUrl ? (
                <div className="rounded-2xl relative mb-8 aspect-[16/9] overflow-hidden bg-white">
                  <Image alt={project.imageAlt} className="rounded-2xl object-cover" fill src={project.imageUrl} unoptimized />
                </div>
              ) : null}
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">{project.title}</h2>
                {project.isFeatured ? <span className="text-xs uppercase tracking-wide text-black/50">Featured</span> : null}
              </div>
              <p className="mt-3 leading-7 text-black/65">{project.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-black/55">
                {project.technologies.map((technology) =>
                  <span className="rounded-2xl bg-white border border-black/15 px-2 py-1" key={technology}>{technology}</span>)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}