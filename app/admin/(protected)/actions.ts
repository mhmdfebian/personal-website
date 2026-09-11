"use server";

import { redirect } from "next/navigation";

import { deleteAdminSession, requireAdmin } from "@/lib/auth/session";

export async function logoutAction() {
  await requireAdmin();
  await deleteAdminSession();
  redirect("/admin/login");
}