import Image from "next/image";

export default function AboutPage() {
  return (
    <div>
      {/* About */}
      <section className="mx-auto grid w-full max-w-6xl gap-16 px-6 pt-24 pb-20 md:grid-cols-2 md:pt-32 md:pb-28">

        {/* Left */}
        <div className="max-w-2xl">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-black/50">
            About Me
          </p>

          <div className="space-y-6 text-lg leading-8 text-black/70">
            <h1 className="text-5xl font-medium leading-[1.05] tracking-tight text-black md:text-5xl">
              Hello I&apos;m{" "}
              <span className="font-semibold">Febian</span>,
            </h1>

            <p>
              I started my career as a software developer, building
              applications and figuring out how things work. Somewhere along
              the way, I got curious about the data behind those systems.
            </p>

            <p>
              That curiosity eventually led me to data engineering.
            </p>

            <p>
              These days, I spend my time building pipelines, working with
              data platforms, solving messy data problems, and occasionally
              wondering why a pipeline worked perfectly yesterday.
            </p>

            <div className="grid gap-6 border-t border-black/10 pt-6 text-sm text-black/60 sm:grid-cols-2">
              <div>
                <p className="mb-1 font-semibold text-black">Background</p>
                <p>
                  Started in software development, now focused on data and
                  everything around it.
                </p>
              </div>

              <div>
                <p className="mb-1 font-semibold text-black">Focus</p>
                <p>
                  Data Engineering, data pipelines, lakehouse, and building
                  reliable data systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-start justify-center md:justify-end">
          <div className="relative h-[420px] w-[420px] overflow-hidden rounded-full">
            <Image
              src="/kaka.png"
              alt="Febian"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 md:pb-28">
        <p className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-black/50">
          Skills
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl border border-black/10 px-8 py-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Data Engineering
            </h2>

            <p className="mt-3 leading-7 text-black/65">
              Data pipelines, ETL, ELT, Lakehouse, data transformation,
              orchestration, and data platforms.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/10 px-8 py-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Development
            </h2>

            <p className="mt-3 leading-7 text-black/65">
              Next.js, React, TypeScript, API integration, backend development,
              and application architecture.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}