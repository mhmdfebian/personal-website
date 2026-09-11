"use client";

export default function SeoError({ reset }: { reset: () => void }) {
  return <section className="border border-red-200 bg-red-50 p-6"><h1 className="text-xl font-semibold">SEO settings could not be loaded</h1><button className="mt-4 border border-black/20 px-3 py-2 text-sm" onClick={reset} type="button">Try again</button></section>;
}