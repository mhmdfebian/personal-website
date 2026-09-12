export default function AboutPage() {
  return (
    <section
      className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28"
    >
      <header>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-black/50">
          About
        </p>

        <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
          I started with code.
          Then came data.
        </h1>
      </header>

      <div className="max-w-2xl space-y-4 text-lg leading-8 text-black/70">

          <p>
            I started my career as a software developer, building applications and
            figuring out how things work. Somewhere along the way, I got curious about
            the data behind those systems.
          </p>

          <p>
            That curiosity eventually led me to data engineering.
          </p>

          <p>
            These days, I spend my time building pipelines, working with data
            platforms, solving messy data problems, and occasionally wondering why a
            pipeline worked perfectly yesterday.
          </p>

        <div className="grid gap-5 border-t border-black/10 pt-6 text-sm text-black/60 sm:grid-cols-2">
          <div>
            <p className="mb-1 font-semibold text-black">Focus</p>
            <p>Data Engineering, data pipelines, lakehouse, and building reliable data systems.</p>
          </div>

          <div>
            <p className="mb-1 font-semibold text-black">Background</p>
            <p>Started in software development, now focused on data and everything around it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}