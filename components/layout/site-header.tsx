import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteNav } from "@/components/layout/site-nav";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="absolute left-0 top-0 z-50 w-full px-6 pt-5">
      <div className="mx-auto flex w-fit items-center gap-8 rounded-full border border-black/5 bg-white/95 px-5 py-2.5 shadow-[0_2px_15px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="mr-40">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/bn-logo-transparent.png"
              alt="BN Logo"
              width={50}
              height={40}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <SiteNav />

        {/* Mobile Navigation */}
        <MobileNav />

      </div>
    </header>
  );
}