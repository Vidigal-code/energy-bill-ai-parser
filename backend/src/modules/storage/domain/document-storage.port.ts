export type UploadDocumentInput = {
  objectKey: string;
  content: Buffer;
  mimeType: string;
};

export type StoredDocumentFile = {
  content: Buffer;
  mimeType: string;
};

export interface DocumentStoragePort {
  upload(input: UploadDocumentInput): Promise<void>;
  download(objectKey: string): Promise<StoredDocumentFile>;
  remove(objectKey: string): Promise<void>;
}

export const DOCUMENT_STORAGE_TOKEN = Symbol('DOCUMENT_STORAGE_TOKEN');
