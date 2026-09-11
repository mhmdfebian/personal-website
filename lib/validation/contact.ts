import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254, "Email is too long."),
  subject: z.string().trim().min(1, "Subject is required.").max(180, "Subject is too long."),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000, "Message is too long."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;