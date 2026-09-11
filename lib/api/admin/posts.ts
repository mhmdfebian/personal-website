import { eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";

export async function getAdminPosts() {
  await requireAdmin();
  return db.select().from(posts);
}

export async function getAdminPostById(id: number) {
  await requireAdmin();

  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0];
}