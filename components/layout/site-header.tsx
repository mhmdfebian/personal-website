import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteNav } from "@/components/layout/site-nav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-black/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-bn.png"
            alt="BN Logo"
            width={50}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <SiteNav />
        <MobileNav />

      </div>
    </header>
  );
}