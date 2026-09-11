"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createProject,
  deleteProject,
  setProjectFeatured,
  setProjectPublished,
  updateProject,
} from "@/lib/api/admin/projects";
import { requireAdmin } from "@/lib/auth/session";
import { projectInputFromFormData } from "@/lib/validation/project";
import { contentSeoInputFromFormData } from "@/lib/validation/seo";
import { upsertProjectSeo } from "@/lib/api/seo";

export type ProjectActionState = {
  error?: string;
};

function projectIdFromFormData(formData: FormData) {
  const value = Number(formData.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function databaseErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.includes("projects_slug_idx")) {
    return "That slug is already in use.";
  }

  if (error instanceof Error && error.message === "Media not found.") {
    return error.message;
  }

  return "The project could not be saved. Please try again.";
}

export async function createProjectAction(
  _: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdmin();
  const parsed = projectInputFromFormData(formData);

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid project data." };

  try {
    const project = await createProject(parsed.data);
    const seo = contentSeoInputFromFormData(formData);
    if (!seo.success) return { error: seo.error.issues[0]?.message ?? "Invalid SEO data." };
    await upsertProjectSeo(project.id, seo.data);
  } catch (error) {
    return { error: databaseErrorMessage(error) };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(
  _: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdmin();
  const id = projectIdFromFormData(formData);
  const parsed = projectInputFromFormData(formData);

  if (!id) return { error: "Invalid project ID." };
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid project data." };

  try {
    const project = await updateProject(id, parsed.data);
    if (!project) return { error: "Project not found." };
    const seo = contentSeoInputFromFormData(formData);
    if (!seo.success) return { error: seo.error.issues[0]?.message ?? "Invalid SEO data." };
    await upsertProjectSeo(id, seo.data);
  } catch (error) {
    return { error: databaseErrorMessage(error) };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();
  const id = projectIdFromFormData(formData);

  if (!id) throw new Error("Invalid project ID.");

  try {
    const deleted = await deleteProject(id);
    if (!deleted) throw new Error("Project not found.");
  } catch (error) {
    if (error instanceof Error && error.message === "Project not found.") throw error;
    throw new Error("The project could not be deleted.");
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function togglePublishedAction(formData: FormData) {
  await requireAdmin();
  const id = projectIdFromFormData(formData);
  const isPublished = formData.get("isPublished") === "true";

  if (!id) throw new Error("Invalid project ID.");
  const project = await setProjectPublished(id, !isPublished);
  if (!project) throw new Error("Project not found.");

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function toggleFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = projectIdFromFormData(formData);
  const isFeatured = formData.get("isFeatured") === "true";

  if (!id) throw new Error("Invalid project ID.");
  const project = await setProjectFeatured(id, !isFeatured);
  if (!project) throw new Error("Project not found.");

  revalidatePath("/");
  revalidatePath("/admin/projects");
}