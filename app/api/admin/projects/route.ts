import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/session";

export async function POST() {
  const admin = await requireAdminApi();

  if (!admin) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Project mutations are not implemented in this stage." },
    { status: 501 },
  );
}