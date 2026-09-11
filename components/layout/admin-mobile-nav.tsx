"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  ["Projects", "/admin/projects"],
  ["Experience", "/admin/experience"],
  ["Blog", "/admin/blog"],
  ["Categories", "/admin/categories"],
  ["Tags", "/admin/tags"],
  ["Media", "/admin/media"],
  ["SEO", "/admin/seo"],
  ["Messages", "/admin/messages"],
] as const;

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return <div className="md:hidden"><button aria-expanded={open} aria-label={open ? "Close CMS navigation" : "Open CMS navigation"} className="focus-ring min-h-11 min-w-11 border border-black/15 text-lg" onClick={() => setOpen((value) => !value)} type="button">{open ? "×" : "≡"}</button>{open ? <nav aria-label="CMS mobile navigation" className="absolute inset-x-0 top-full z-20 border-b border-black/10 bg-white px-6 py-3 shadow-sm"><ul className="mx-auto max-w-6xl">{navigation.map(([label, href]) => { const active = pathname === href || pathname.startsWith(`${href}/`); return <li key={href}><Link aria-current={active ? "page" : undefined} className={`block border-b border-black/10 py-3 text-sm last:border-0 ${active ? "font-semibold" : ""}`} href={href} onClick={() => setOpen(false)}>{label}</Link></li>; })}</ul></nav> : null}</div>;
}
