"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-black/15 text-sm"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span aria-hidden="true" className="text-lg leading-none">{open ? "×" : "≡"}</span>
      </button>
      {open ? (
        <nav aria-label="Mobile navigation" className="absolute inset-x-0 top-full z-20 border-b border-black/10 bg-white px-6 py-4 shadow-sm">
          <ul className="mx-auto max-w-6xl divide-y divide-black/10">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return <li key={item.href}><Link aria-current={active ? "page" : undefined} className={`block py-4 text-lg ${active ? "font-semibold" : ""}`} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link></li>;
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
