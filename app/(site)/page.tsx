import Link from "next/link";
import Image from "next/image";


import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedPosts } from "@/lib/api/posts";
import { getPublishedExperience } from "@/lib/api/experience";
import { getFeaturedProjects } from "@/lib/api/projects";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Personal website",
  url: "/",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProjects, experiences, posts] = await Promise.all([
    getFeaturedProjects(),
    getPublishedExperience(),
    getPublishedPosts({ pageSize: 3 }),
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-zinc-100 px-6 pt-32 pb-28 md:pt-40 md:pb-36">
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-black/60">
              DATA ENGINEER
            </p>
            <h1 className="max-w-2xl text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
              Making data
              a little less messy.
            </h1>
          </div>
          <div className="max-w-xl text-lg leading-8 text-black/70">
            <p>
              I enjoy building data pipelines, solving problems, and turning raw data into something useful.
            </p>
            <Link
              className="mt-8 inline-flex border-b border-black pb-1 font-medium transition-opacity hover:opacity-60"
              href="/about"
            >
              More about me <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6"><SectionHeading eyebrow="Selected work">Recent projects</SectionHeading>
          <Link className="text-sm font-medium underline underline-offset-4" href="/projects">
            View all
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project.id}
                className="group rounded-2xl border border-black/10 bg-white p-8 transition-all duration-300 hover:border-black/20 hover:bg-zinc-100 hover:shadow-sm"
              >
                <p className="mb-4 text-sm text-black/50">
                  Featured project
                </p>

                {project.imageUrl ? (
                  <div className="relative mb-8 aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100">
                    <Image alt={project.imageAlt} className="object-cover" fill src={project.imageUrl} unoptimized />
                  </div>
                ) : null}

                <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-black">
                  {project.title}
                </h3>

                <p className="mt-3 max-w-md leading-7 text-black/65">
                  {project.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <Badge key={technology}>
                      {technology}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-black/20 px-8 py-12 text-black/60">
            Featured projects will appear here soon.
          </div>
        )}
      </section>

      <section className=" px-6 py-20 bg-zinc-100">
        <div className="mx-auto grid w-full max-w-6xl gap-16 md:grid-cols-2">
          <div><SectionHeading eyebrow="Experience">How I work</SectionHeading><p className="max-w-md leading-8 text-black/65">I work across product, design, and engineering to make complex ideas easier to use and easier to maintain.</p><Link className="mt-8 inline-flex border-b border-black pb-1 font-medium transition-opacity hover:opacity-60" href="/experience">View experience ↗</Link></div>
          <div className="space-y-6">{experiences.slice(0, 3).map((experience) => <article className="pb-5" key={experience.id}><p className="text-sm text-black/50">{experience.company}</p><h3 className="mt-1 text-xl font-semibold">{experience.role}</h3></article>)}{experiences.length === 0 ? <p className="text-black/60">Experience entries will appear here soon.</p> : null}</div>
        </div>
      </section>

      {/* <section className="mx-auto w-full max-w-6xl px-6 py-20"><div className="flex items-end justify-between gap-6"><SectionHeading eyebrow="Writing">Latest notes</SectionHeading><Link className="text-sm font-medium underline underline-offset-4" href="/blog">Read the blog</Link></div><div className="grid gap-6 md:grid-cols-3">{posts.map((post) => <article className="border-t border-black/15 pt-5" key={post.id}><p className="text-sm text-black/50">{post.category?.name ?? "Writing"}</p><h3 className="mt-2 text-xl font-semibold"><Link className="hover:opacity-60" href={`/blog/${post.slug}`}>{post.title}</Link></h3><p className="mt-3 leading-7 text-black/65">{post.excerpt}</p></article>)}{posts.length === 0 ? <p className="text-black/60">New writing will appear here soon.</p> : null}</div></section> */}

      <section className="bg-white px-6 py-20 ">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-black/50">Let&apos;s talk</p>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
              Have a good problem to solve?
            </h2>
          </div>
          <Link className="self-start mt-8 inline-flex border-b border-black pb-1 font-medium transition-opacity hover:opacity-60" href="/contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}