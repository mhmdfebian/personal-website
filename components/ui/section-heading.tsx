import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return <div className="mb-10"><>{eyebrow ? <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-black/50">{eyebrow}</p> : null}</><h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{children}</h2></div>;
}
