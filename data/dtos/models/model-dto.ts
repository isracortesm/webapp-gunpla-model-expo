export interface ImageDto {
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

export interface ReferenceDto {
  id: number;
  documentId?: string;
  type: string;
  name: string;
  url: string;
}

export interface ModelUserDto {
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

export interface ModelDto {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: ImageDto | null;
  references?: ReferenceDto[];
  user?: ModelUserDto | null;
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
