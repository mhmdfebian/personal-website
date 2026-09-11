import { localStorage } from "@/lib/storage/local";
import type { StorageProvider } from "@/lib/storage/storage";

const provider = process.env.STORAGE_PROVIDER ?? "local";

if (provider !== "local") {
  throw new Error(
    `Unsupported STORAGE_PROVIDER: ${provider}. Production storage provider has not been configured yet.`,
  );
}

export const storage: StorageProvider = localStorage;