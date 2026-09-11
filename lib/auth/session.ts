import { createHash, randomBytes } from "node:crypto";

import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db/client";
import { adminSessions, adminUsers } from "@/lib/db/schema";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type CurrentAdmin = Pick<typeof adminUsers.$inferSelect, "id" | "email">;

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(adminId: number) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
  await db.insert(adminSessions).values({ tokenHash, adminUserId: adminId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));

  const result = await db
    .select({ id: adminUsers.id, email: adminUsers.email })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
    .where(and(eq(adminSessions.tokenHash, hashSessionToken(token)), gt(adminSessions.expiresAt, new Date())))
    .limit(1);

  return result[0] ?? null;
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashSessionToken(token)));
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) redirect("/admin/login");

  return admin;
}

export async function requireAdminApi() {
  return getCurrentAdmin();
}