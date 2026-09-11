import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteNav } from "@/components/layout/site-nav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-black/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link className="font-semibold tracking-tight" href="/">
          Personal website
        </Link>
        <SiteNav />
        <MobileNav />
      </div>
    </header>
  );
}