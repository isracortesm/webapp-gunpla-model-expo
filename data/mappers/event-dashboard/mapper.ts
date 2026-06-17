import { MediaEntity, CategoryEntity, EventEntity, NewsEntity, ActivityEntity } from '../../../domain/entities/event-dashboard/entity';

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
}

interface StrapiEventResponse {
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

interface StrapiNewsResponse {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  order: number;
  publishedAt: string;
  thumbnail?: StrapiMediaResponse;
}

interface StrapiActivityResponse {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  costType: 'free' | 'paid';
  cost: number | null;
  startDate: string;
  endDate: string;
  image?: StrapiMediaResponse;
  category?: StrapiCategoryResponse;
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
    title: dto.title,
    subtitle: dto.subtitle,
    content: dto.content,
    order: dto.order,
    publishedAt: dto.publishedAt,
    thumbnail,
  };
}

export function mapActivityDtoToEntity(dto: StrapiActivityResponse): ActivityEntity {
  const image = dto.image ? mapStrapiMediaToEntity(dto.image) : undefined;
  const category = dto.category ? mapStrapiCategoryToEntity(dto.category) : undefined;

  return {
    id: dto.id,
    name: dto.name,
    shortDescription: dto.shortDescription,
    description: dto.description,
    costType: dto.costType,
    cost: dto.cost,
    startDate: dto.startDate,
    endDate: dto.endDate,
    image,
    category,
  };
}
