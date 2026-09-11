"use server";

import { headers } from "next/headers";

import { createContactMessage } from "@/lib/api/messages";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { contactMessageSchema } from "@/lib/validation/contact";

export type ContactActionState = { error?: string; success?: string };

export async function submitContactAction(_: ContactActionState, formData: FormData): Promise<ContactActionState> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim()) return { success: "Thanks, your message has been sent." };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? requestHeaders.get("x-real-ip") ?? "unknown";
  const rateLimit = checkContactRateLimit(ip);
  if (!rateLimit.allowed) return { error: "Too many messages. Please try again later." };

  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check your message." };

  try {
    await createContactMessage(parsed.data);
    return { success: "Thanks, your message has been sent." };
  } catch {
    return { error: "We could not send your message. Please try again." };
  }
}