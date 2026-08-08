import { MediaEntity, CategoryEntity, EventEntity, NewsEntity, ActivityEntity, CollaboratorEntity, CollaboratorEvaluationMetadata } from '../../../domain/entities/event-dashboard/entity';

// Strapi v4 response types (flat structure without attributes wrapper)
interface StrapiMediaResponse {
  id: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: {
      url: string;
      width?: number;
      height?: number;
    };
  };
}

interface StrapiCategoryResponse {
  id: number;
  name: string;
  description: string;
  type?: 'competition' | 'workshop' | 'seminar';
}

export interface StrapiEventResponse {
  id: number;
  eventId: string;
  name: string;
  shortDescription: string;
  description: string;
  costType: 'free' | 'paid';
  cost: number | null;
  startDate: string;
  endDate: string;
  image?: StrapiMediaResponse;
  category?: StrapiCategoryResponse;
  socialNetworks?: StrapiSocialNetworkResponse[];
}

export interface StrapiNewsResponse {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  content: string;
  order: number;
  publishedAt: string;
  thumbnail?: StrapiMediaResponse;
  user?: unknown;
}

export interface StrapiActivityResponse {
  id: number;
  documentId: string;
  name: string;
  shortDescription: string;
  description?: string;
  costType: 'free' | 'paid';
  cost: number | null;
  startDate: string;
  endDate: string;
  capacity?: number;
  participantsCount?: number;
  image?: StrapiMediaResponse;
  category?: StrapiCategoryResponse;
  collaborators?: StrapiCollaboratorResponse[];
}

interface StrapiCollaboratorResponse {
  id: number;
  documentId?: string;
  role: string;
  description?: string;
  user?: unknown;
  metadata?: CollaboratorEvaluationMetadata;
}

interface StrapiSocialNetworkResponse {
  id: number;
  type: string;
  name: string;
  url: string;
}

export function mapStrapiMediaToEntity(dto: StrapiMediaResponse): MediaEntity {
  const thumbnailUrl = dto.formats?.thumbnail?.url || dto.thumbnailUrl;

  return {
    id: dto.id,
    name: '', // API doesn't provide name for nested images
    url: dto.url,
    thumbnailUrl,
    width: dto.width,
    height: dto.height,
  };
}

export function mapStrapiCategoryToEntity(dto: StrapiCategoryResponse): CategoryEntity {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    type: dto.type,
  };
}

export function mapEventDtoToEntity(dto: StrapiEventResponse): EventEntity {
  const image = dto.image ? mapStrapiMediaToEntity(dto.image) : undefined;
  const category = dto.category ? mapStrapiCategoryToEntity(dto.category) : undefined;

  return {
    id: dto.id,
    eventId: dto.eventId,
    name: dto.name,
    shortDescription: dto.shortDescription,
    description: dto.description,
    costType: dto.costType,
    cost: dto.cost,
    startDate: dto.startDate,
    endDate: dto.endDate,
    image,
    category,
    socialNetworks: dto.socialNetworks?.map((sn) => ({
      id: sn.id,
      type: sn.type,
      name: sn.name,
      url: sn.url,
    })),
  };
}

export function mapNewsDtoToEntity(dto: StrapiNewsResponse): NewsEntity {
  const thumbnail = dto.thumbnail ? mapStrapiMediaToEntity(dto.thumbnail) : undefined;

  return {
    id: dto.id,
    documentId: dto.documentId,
    title: dto.title,
    subtitle: dto.subtitle,
    content: dto.content,
    order: dto.order,
    publishedAt: dto.publishedAt,
    thumbnail,
    user: dto.user,
  };
}

export function mapActivityDtoToEntity(dto: StrapiActivityResponse): ActivityEntity {
  const image = dto.image ? mapStrapiMediaToEntity(dto.image) : undefined;
  const category = dto.category ? mapStrapiCategoryToEntity(dto.category) : undefined;

  return {
    id: dto.id,
    documentId: dto.documentId,
    name: dto.name,
    shortDescription: dto.shortDescription,
    description: dto.description,
    costType: dto.costType,
    cost: dto.cost,
    startDate: dto.startDate,
    endDate: dto.endDate,
    capacity: dto.capacity,
    participantsCount: dto.participantsCount,
    image,
    category,
    collaborators: dto.collaborators?.map((c) => ({
      id: c.id,
      documentId: c.documentId,
      role: c.role,
      description: c.description,
      user: c.user,
      metadata: c.metadata,
    })),
  };
}
