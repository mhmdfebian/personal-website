import { vercelBlobStorage } from "@/lib/storage/vercel-blob";
import { localStorage } from "@/lib/storage/local";
import type { StorageProvider } from "@/lib/storage/storage";

export const storage: StorageProvider =
  process.env.BLOB_READ_WRITE_TOKEN
    ? vercelBlobStorage
    : localStorage;