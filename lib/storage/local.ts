import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { StorageProvider } from "@/lib/storage/storage";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

function safePath(key: string) {
  const normalized = path.posix.normalize(key).replace(/^\/+/, "");
  if (normalized.includes("..")) throw new Error("Invalid storage key.");
  return path.join(uploadDirectory, normalized);
}

export const localStorage: StorageProvider = {
  async upload({ key, body }) {
    const destination = safePath(key);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, body, { flag: "wx" });
    return { key, url: `/uploads/${key}` };
  },
  async delete(key) {
    try {
      await unlink(safePath(key));
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return;
      throw error;
    }
  },
  getUrl(key) {
    return `/uploads/${key}`;
  },
};