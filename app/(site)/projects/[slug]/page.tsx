import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getGlobalSeo, getProjectSeo } from "@/lib/api/seo";
import { getPublishedProjectBySlug } from "@/lib/api/projects";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type ProjectPageProps = { params: Promise<{ slug: string }> };

async function getProject(params: ProjectPageProps["params"]) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params);
  const [global, content] = await Promise.all([getGlobalSeo(), getProjectSeo(project.id)]);
  return buildMetadata({ global, content, fallbackTitle: project.title, fallbackDescription: project.summary, fallbackImage: project.imageUrl ? { url: project.imageUrl, alt: project.imageAlt } : null, path: `/projects/${project.slug}` });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProject(params);

  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-20">
      <Link className="text-sm text-black/60 underline underline-offset-4" href="/projects">← Back to projects</Link>
      <header className="mt-10 border-b border-black/10 pb-10">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-black/50">Project</p>
        <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-black/65">{project.summary}</p>
      </header>
      {project.imageUrl ? (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-zinc-100">
          <Image alt={project.imageAlt} className="object-cover" fill src={project.imageUrl} unoptimized />
        </div>
      ) : null}
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_220px]">
        <div className="whitespace-pre-wrap leading-8 text-black/75">{project.content}</div>
        <aside className="space-y-6 text-sm">
          <div>
            <p className="mb-2 uppercase tracking-wide text-black/45">Technologies</p>
            <div className="flex flex-wrap gap-2">{project.technologies.map((technology) => <span className="border border-black/15 px-2 py-1" key={technology}>{technology}</span>)}</div>
          </div>
          <div className="flex flex-col gap-2">
            {project.repositoryUrl ? <a className="underline underline-offset-4" href={project.repositoryUrl} rel="noreferrer" target="_blank">GitHub ↗</a> : null}
            {project.projectUrl ? <a className="underline underline-offset-4" href={project.projectUrl} rel="noreferrer" target="_blank">Live demo ↗</a> : null}
          </div>
        </aside>
      </div>
    </article>
  );
}