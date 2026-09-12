import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-2xl items-center border border-black/15 px-2 py-1 text-xs font-medium text-black/65">{children}</span>;
}
