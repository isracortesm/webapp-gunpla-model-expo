export interface ImageEntity {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  focalPoint?: any | null;
  width: number;
  height: number;
  formats: Record<string, {
    ext: string;
    url: string;
    etag: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
  }>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ReferenceEntity {
  id: number;
  type: string;
  name: string;
  url: string;
}

export interface ModelUserEntity {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  aboutMe?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ModelEntity {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: ImageEntity | null;
  references?: ReferenceEntity[];
  user?: ModelUserEntity | null;
}
