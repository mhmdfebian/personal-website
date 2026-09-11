import { z } from "zod";

export const MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB ?? 5);
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export const allowedImageTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
} as const;

export const mediaMetadataSchema = z.object({
  alt: z.string().trim().max(300),
  caption: z.string().trim().max(1000),
});

export const mediaIdSchema = z.coerce.number().int().positive();

export function validateMediaFile(file: File) {
  if (file.size <= 0) return "The uploaded file is empty.";
  if (file.size > MAX_UPLOAD_SIZE_BYTES) return `Images must be ${MAX_UPLOAD_SIZE_MB} MB or smaller.`;

  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  const expectedExtension = allowedImageTypes[file.type as keyof typeof allowedImageTypes];
  if (!expectedExtension || extension !== expectedExtension) return "Only JPEG, PNG, and WebP images are supported.";
  return null;
}

export function detectImageType(buffer: Buffer) {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return { mimeType: "image/jpeg", extension: ".jpg" };
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mimeType: "image/png", extension: ".png" };
  if (buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP") return { mimeType: "image/webp", extension: ".webp" };
  return null;
}