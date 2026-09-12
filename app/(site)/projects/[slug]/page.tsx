import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getGlobalSeo, getProjectSeo } from "@/lib/api/seo";
import { getPublishedProjectBySlug } from "@/lib/api/projects";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProject(params: ProjectPageProps["params"]) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return project;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params);

  const [global, content] = await Promise.all([
    getGlobalSeo(),
    getProjectSeo(project.id),
  ]);

  return buildMetadata({
    global,
    content,
    fallbackTitle: project.title,
    fallbackDescription: project.summary,
    fallbackImage: project.imageUrl
      ? {
        url: project.imageUrl,
        alt: project.imageAlt,
      }
      : null,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectPageProps) {
  const project = await getProject(params);

  return (
    <article className="mx-auto w-full max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">

      {/* Header */}
      <header className="max-w-4xl pb-10">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-black/50">
          Project
        </p>

        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
          {project.title}
        </h1>

        {/* <p className="mt-6 max-w-2xl text-xl leading-8 text-black/65">
          {project.summary}
        </p> */}
      </header>

      {/* Project Image */}
      {project.imageUrl ? (
        <div className="aspect-[16/9] rounded-2xl border border-black/10 bg-white p-10">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10">
            <Image
              alt={project.imageAlt}
              className="object-cover"
              fill
              src={project.imageUrl}
              unoptimized
            />
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_240px]">

        {/* Main Content */}
        <div className="max-w-3xl">
          <div className="whitespace-pre-wrap text-lg leading-8 text-black/75">
            {project.content}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 text-sm">

          {/* Technologies */}
          <div>
            <p className="mb-3 font-medium uppercase tracking-[0.15em] text-black/45">
              Technologies
            </p>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-black/60"
                  key={technology}
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {(project.repositoryUrl || project.projectUrl) && (
            <div className="flex flex-col gap-3 border-t border-black/10 pt-6">
              {project.repositoryUrl ? (
                <a
                  className="font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
                  href={project.repositoryUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub ↗
                </a>
              ) : null}

              {project.projectUrl ? (
                <a
                  className="font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
                  href={project.projectUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Live demo ↗
                </a>
              ) : null}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}