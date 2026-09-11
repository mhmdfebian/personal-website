export type StorageObject = { key: string; url: string };

export interface StorageProvider {
  upload(input: { key: string; body: Buffer; contentType: string }): Promise<StorageObject>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}