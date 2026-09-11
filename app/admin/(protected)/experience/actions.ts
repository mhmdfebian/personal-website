"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createExperience,
  deleteExperience,
  setExperienceCurrent,
  updateExperience,
} from "@/lib/api/experience";
import { requireAdmin } from "@/lib/auth/session";
import { experienceInputFromFormData } from "@/lib/validation/experience";

export type ExperienceActionState = { error?: string };

function experienceIdFromFormData(formData: FormData) {
  const value = Number(formData.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function databaseErrorMessage() {
  return "The experience could not be saved. Please try again.";
}

export async function createExperienceAction(
  _: ExperienceActionState,
  formData: FormData,
): Promise<ExperienceActionState> {
  await requireAdmin();
  const parsed = experienceInputFromFormData(formData);

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid experience data." };

  try {
    await createExperience(parsed.data);
  } catch {
    return { error: databaseErrorMessage() };
  }

  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function updateExperienceAction(
  _: ExperienceActionState,
  formData: FormData,
): Promise<ExperienceActionState> {
  await requireAdmin();
  const id = experienceIdFromFormData(formData);
  const parsed = experienceInputFromFormData(formData);

  if (!id) return { error: "Invalid experience ID." };
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid experience data." };

  try {
    const experience = await updateExperience(id, parsed.data);
    if (!experience) return { error: "Experience not found." };
  } catch {
    return { error: databaseErrorMessage() };
  }

  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function deleteExperienceAction(formData: FormData) {
  await requireAdmin();
  const id = experienceIdFromFormData(formData);
  if (!id) throw new Error("Invalid experience ID.");

  try {
    if (!(await deleteExperience(id))) throw new Error("Experience not found.");
  } catch (error) {
    if (error instanceof Error && error.message === "Experience not found.") throw error;
    throw new Error("The experience could not be deleted.");
  }

  revalidatePath("/experience");
  revalidatePath("/admin/experience");
}

export async function toggleCurrentAction(formData: FormData) {
  await requireAdmin();
  const id = experienceIdFromFormData(formData);
  const isCurrent = formData.get("isCurrent") === "true";
  if (!id) throw new Error("Invalid experience ID.");

  if (!(await setExperienceCurrent(id, !isCurrent))) throw new Error("Experience not found.");

  revalidatePath("/experience");
  revalidatePath("/admin/experience");
}