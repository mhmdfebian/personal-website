"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { checkLoginRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginState = { error?: string };

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? requestHeaders.get("x-real-ip") ?? "unknown";
  if (!checkLoginRateLimit(ip).allowed) return { error: "Too many login attempts. Please try again later." };
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: "Enter a valid email and password." };

  const email = parsed.data.email.toLowerCase();
  const result = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  const admin = result[0];

  if (!admin || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createAdminSession(admin.id);
  redirect("/admin/dashboard");
}