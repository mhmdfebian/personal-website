import { localStorage } from "@/lib/storage/local";
import type { StorageProvider } from "@/lib/storage/storage";

export const storage: StorageProvider = localStorage;