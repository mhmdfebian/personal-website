"use client";

export default function ExperienceError({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-4xl px-6 py-20"><h1 className="text-3xl font-semibold">Experience could not be loaded</h1><button className="mt-5 border border-black/20 px-3 py-2 text-sm" onClick={reset} type="button">Try again</button></section>;
}