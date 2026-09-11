import type { ReactNode } from "react";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";

import { logoutAction } from "./actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-black/10 bg-white px-6 py-4">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="font-semibold">CMS dashboard</p>
            <p className="text-sm text-black/60">{admin.email}</p>
          </div>
          <nav aria-label="CMS navigation" className="hidden gap-4 text-sm md:flex">
            <Link href="/admin/projects">Projects</Link>
            <Link href="/admin/experience">Experience</Link>
            <Link href="/admin/blog">Blog</Link>
            <Link href="/admin/categories">Categories</Link>
            <Link href="/admin/tags">Tags</Link>
            <Link href="/admin/media">Media</Link>
            <Link href="/admin/seo">SEO</Link>
            <Link href="/admin/messages">Messages</Link>
          </nav>
          <AdminMobileNav />
          <form action={logoutAction}>
            <button className="border border-black/20 px-3 py-2 text-sm" type="submit">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
    </div>
  );
}