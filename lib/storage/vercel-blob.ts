import { del, put } from "@vercel/blob";

import type { StorageProvider } from "@/lib/storage/storage";

export const vercelBlobStorage: StorageProvider = {
    async upload({ key, body, contentType }) {
        const blob = await put(key, body, {
            access: "public",
            contentType,
            addRandomSuffix: false,
        });

        return {
            key: blob.pathname,
            url: blob.url,
        };
    },

    async delete(key) {
        await del(key);
    },

    getUrl(key) {
        return key;
    },
};