"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  return <nav aria-label="Primary navigation" className="hidden gap-6 text-sm md:flex">{navigation.map((item) => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link aria-current={active ? "page" : undefined} className={`focus-ring transition-colors hover:text-black/60 ${active ? "font-semibold text-black" : "text-black/65"}`} href={item.href} key={item.href}>{item.label}</Link>; })}</nav>;
}
