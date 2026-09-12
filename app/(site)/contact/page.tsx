import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { getGlobalSeo } from "@/lib/api/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobalSeo();
  return buildMetadata({ global, fallbackTitle: "Contact", fallbackDescription: "Get in touch about a project, collaboration, or good problem to solve.", path: "/contact" });
}

export default function ContactPage() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-16 px-6 pt-24 pb-20 md:grid-cols-2 md:pt-32 md:pb-28">
      <header>
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-black/50">
          Contact
        </p>

        <h1 className="text-5xl font-semibold tracking-tight md:text-5xl">
          Let&apos;s talk.
        </h1>

        <p className="mt-6 max-w-sm text-lg leading-8 text-black/65">
          Have a project, question, or thoughtful problem? Send a note and I&apos;ll
          get back to you.
        </p>
      </header>

      <ContactForm />
    </section>
  );
}