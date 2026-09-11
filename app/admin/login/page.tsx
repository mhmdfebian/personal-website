import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth/session";

import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) redirect("/admin/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 py-16">
      <section className="w-full max-w-md border border-black/10 bg-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-2 mb-8 text-sm text-black/60">Access the content management area.</p>
        <LoginForm />
      </section>
    </main>
  );
}