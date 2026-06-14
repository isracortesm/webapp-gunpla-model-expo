import { MediaEntity, CategoryEntity, EventEntity, NewsEntity, ActivityEntity } from '../types/entity';
import { MediaDto, CategoryDto, EventDto, NewsDto, ActivityDto } from '../types/dto';

export function mapMediaDtoToEntity(dto: MediaDto): MediaEntity {
  const thumbnailUrl = dto.attributes.formats?.thumbnail?.url;
  
  return {
    id: dto.id,
    name: dto.attributes.name,
    url: dto.attributes.url,
    thumbnailUrl,
    width: dto.attributes.width,
    height: dto.attributes.height,
  };
}

export function mapCategoryDtoToEntity(dto: CategoryDto): CategoryEntity {
  return {
    id: dto.id,
    name: dto.attributes.name,
    description: dto.attributes.description,
  };
}

export function mapEventDtoToEntity(dto: EventDto): EventEntity {
  const image = dto.attributes.image ? mapMediaDtoToEntity(dto.attributes.image) : undefined;
  const category = dto.attributes.category ? mapCategoryDtoToEntity(dto.attributes.category) : undefined;

  return {
    id: dto.id,
    eventId: dto.attributes.eventId,
    name: dto.attributes.name,
    shortDescription: dto.attributes.shortDescription,
    description: dto.attributes.description,
    costType: dto.attributes.costType,
    cost: dto.attributes.cost,
    startDate: dto.attributes.startDate,
    endDate: dto.attributes.endDate,
    image,
    category,
  };
}

export function mapNewsDtoToEntity(dto: NewsDto): NewsEntity {
  const thumbnail = dto.attributes.thumbnail ? mapMediaDtoToEntity(dto.attributes.thumbnail) : undefined;

  return {
    id: dto.id,
    title: dto.attributes.title,
    subtitle: dto.attributes.subtitle,
    content: dto.attributes.content,
    order: dto.attributes.order,
    publishedAt: dto.attributes.publishedAt,
    thumbnail,
  };
}

export function mapActivityDtoToEntity(dto: ActivityDto): ActivityEntity {
  const image = dto.attributes.image ? mapMediaDtoToEntity(dto.attributes.image) : undefined;
  const category = dto.attributes.category ? mapCategoryDtoToEntity(dto.attributes.category) : undefined;

  return {
    id: dto.id,
    name: dto.attributes.name,
    shortDescription: dto.attributes.shortDescription,
    description: dto.attributes.description,
    costType: dto.attributes.costType,
    cost: dto.attributes.cost,
    startDate: dto.attributes.startDate,
    endDate: dto.attributes.endDate,
    image,
    category,
  };
}
