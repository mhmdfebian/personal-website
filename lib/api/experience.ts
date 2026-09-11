import { and, asc, desc, eq, isNull, ne, or } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { experiences } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import type { ExperienceInput } from "@/lib/validation/experience";

export async function getPublishedExperience() {
  return db
    .select()
    .from(experiences)
    .where(and(eq(experiences.isPublished, true), or(eq(experiences.isCurrent, false), isNull(experiences.endDate))))
    .orderBy(asc(experiences.displayOrder), desc(experiences.startDate));
}

export async function getAdminExperiences() {
  await requireAdmin();
  return db.select().from(experiences).orderBy(asc(experiences.displayOrder), desc(experiences.startDate));
}

export async function getAdminExperienceById(id: number) {
  await requireAdmin();
  const result = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  return result[0];
}

type ExperienceTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function clearOtherCurrentExperiences(transaction: ExperienceTransaction, id?: number) {
  await transaction
    .update(experiences)
    .set({ isCurrent: false, updatedAt: new Date() })
    .where(id ? ne(experiences.id, id) : eq(experiences.isCurrent, true));
}

export async function createExperience(input: ExperienceInput) {
  await requireAdmin();

  return db.transaction(async (transaction) => {
    if (input.isCurrent) await clearOtherCurrentExperiences(transaction);

    const result = await transaction.insert(experiences).values({
      company: input.company,
      role: input.role,
      summary: input.summary,
      content: input.summary,
      location: input.location || null,
      technologies: input.technologies,
      displayOrder: input.displayOrder,
      startDate: input.startDate,
      endDate: input.isCurrent ? null : input.endDate,
      isCurrent: input.isCurrent,
      isPublished: input.isPublished,
    }).returning({ id: experiences.id });

    return result[0];
  });
}

export async function updateExperience(id: number, input: ExperienceInput) {
  await requireAdmin();

  return db.transaction(async (transaction) => {
    if (input.isCurrent) await clearOtherCurrentExperiences(transaction, id);

    const result = await transaction
      .update(experiences)
      .set({
        company: input.company,
        role: input.role,
        summary: input.summary,
        content: input.summary,
        location: input.location || null,
        technologies: input.technologies,
        displayOrder: input.displayOrder,
        startDate: input.startDate,
        endDate: input.isCurrent ? null : input.endDate,
        isCurrent: input.isCurrent,
        isPublished: input.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(experiences.id, id))
      .returning({ id: experiences.id });

    return result[0];
  });
}

export async function deleteExperience(id: number) {
  await requireAdmin();
  const result = await db.delete(experiences).where(eq(experiences.id, id)).returning({ id: experiences.id });
  return result.length > 0;
}

export async function setExperienceCurrent(id: number, isCurrent: boolean) {
  await requireAdmin();

  return db.transaction(async (transaction) => {
    if (isCurrent) await clearOtherCurrentExperiences(transaction, id);

    const result = await transaction
      .update(experiences)
      .set({ isCurrent, endDate: isCurrent ? null : undefined, updatedAt: new Date() })
      .where(eq(experiences.id, id))
      .returning({ id: experiences.id });

    return result[0];
  });
}