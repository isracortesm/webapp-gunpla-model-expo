import {
  CompetitionEntity,
  CompetitionCategoryEntity,
  CriteriaEntity,
  CompetitionModelEntryEntity,
  CompetitionResultEntity,
  CompetitionEvaluationEntity,
  CompetitionBatchEntity,
  CompetitionBatchLimitEntity,
} from '../../../domain/entities/competition/entity';
import { ImageEntity } from '../../../domain/entities/models/model-entity';

interface StrapiCriteriaResponse {
  id: number;
  documentId: string;
  name: string;
  description: string;
  maxPoints: number;
  codeName: string;
}

interface StrapiCompetitionCategoryResponse {
  id: number;
  documentId: string;
  name: string;
  description: string;
  criterias: StrapiCriteriaResponse[];
}

export interface StrapiCompetitionResponse {
  id: number;
  documentId: string;
  type: string;
  hasPublicResults: boolean;
  modelsLimit: number;
  categories: StrapiCompetitionCategoryResponse[];
  batchLimits?: StrapiCompetitionBatchLimitResponse[];
}

export interface StrapiCompetitionBatchLimitResponse {
  id: number;
  limit: number;
  assigned: number;
  batch?: StrapiCompetitionBatchResponse | { id: number; documentId: string } | null;
}

function mapCriteriaDtoToEntity(dto: StrapiCriteriaResponse): CriteriaEntity {
  return {
    id: dto.id,
    documentId: dto.documentId,
    name: dto.name,
    description: dto.description,
    maxPoints: dto.maxPoints,
    codeName: dto.codeName,
  };
}

function mapCompetitionCategoryDtoToEntity(
  dto: StrapiCompetitionCategoryResponse
): CompetitionCategoryEntity {
  return {
    id: dto.id,
    documentId: dto.documentId,
    name: dto.name,
    description: dto.description,
    criterias: dto.criterias.map(mapCriteriaDtoToEntity),
  };
}

export function mapCompetitionDtoToEntity(
  dto: StrapiCompetitionResponse
): CompetitionEntity {
  return {
    id: dto.id,
    documentId: dto.documentId,
    type: dto.type,
    hasPublicResults: dto.hasPublicResults,
    modelsLimit: dto.modelsLimit,
    categories: dto.categories.map(mapCompetitionCategoryDtoToEntity),
    batchLimits: (dto.batchLimits ?? []).map(mapCompetitionBatchLimitDtoToEntity),
  };
}

function mapCompetitionBatchLimitDtoToEntity(
  dto: StrapiCompetitionBatchLimitResponse
): CompetitionBatchLimitEntity {
  return {
    id: dto.id,
    limit: dto.limit ?? 0,
    assigned: dto.assigned ?? 0,
    batch: dto.batch ? mapCompetitionBatchDtoToEntity(dto.batch) : null,
  };
}

export interface StrapiCompetitionModelEntryResponse {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user?: {
    id: number;
    documentId?: string;
    username: string;
    email: string;
  };
  category?: StrapiCompetitionCategoryResponse;
  model: {
    id: number;
    documentId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image?: StrapiMediaResponse;
  };
}

export interface StrapiMediaResponse {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width: number;
  height: number;
  formats?: Record<string, { url: string }>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

function mapMediaDtoToEntity(rawImage: StrapiMediaResponse | null | undefined): ImageEntity | undefined {
  if (!rawImage) return undefined;

  return {
    id: rawImage.id,
    documentId: rawImage.documentId,
    name: rawImage.name,
    alternativeText: rawImage.alternativeText ?? null,
    caption: rawImage.caption ?? null,
    focalPoint: null,
    width: rawImage.width,
    height: rawImage.height,
    formats: rawImage.formats as Record<string, { ext: string; url: string; etag: string; hash: string; mime: string; name: string; path: string | null; size: number; width: number; height: number; sizeInBytes: number }>,
    hash: rawImage.hash,
    ext: rawImage.ext,
    mime: rawImage.mime,
    size: rawImage.size,
    url: rawImage.url,
    previewUrl: rawImage.previewUrl ?? null,
    provider: rawImage.provider,
    provider_metadata: rawImage.provider_metadata ?? null,
    createdAt: rawImage.createdAt,
    updatedAt: rawImage.updatedAt,
    publishedAt: rawImage.publishedAt,
  };
}

export function mapCompetitionModelEntryDtoToEntity(
  dto: StrapiCompetitionModelEntryResponse
): CompetitionModelEntryEntity {
  return {
    id: dto.id,
    documentId: dto.documentId,
    model: {
      id: dto.model.id,
      documentId: dto.model.documentId,
      name: dto.model.name,
      description: dto.model.description,
      createdAt: dto.model.createdAt,
      updatedAt: dto.model.updatedAt,
      publishedAt: dto.model.publishedAt,
      image: mapMediaDtoToEntity(dto.model.image),
    },
    user: dto.user
      ? {
          id: dto.user.id,
          username: dto.user.username,
          email: dto.user.email,
        }
      : undefined,
    category: dto.category
      ? mapCompetitionCategoryDtoToEntity(dto.category)
      : undefined,
  };
}

export interface StrapiCompetitionBatchResponse {
  id: number;
  documentId: string;
  batch: string;
  batchName: string;
  batchImage?: StrapiMediaResponse | null;
  requiredValue?: number;
}

export function mapCompetitionBatchDtoToEntity(
  dto: StrapiCompetitionBatchResponse | { id: number; documentId?: string }
): CompetitionBatchEntity {
  const full = dto as StrapiCompetitionBatchResponse;
  const isFull = typeof full.batchName === 'string';

  return {
    id: dto.id,
    documentId: dto.documentId ?? '',
    batch: isFull ? full.batch : 'none',
    batchName: isFull ? full.batchName : '',
    batchImage: isFull ? mapMediaDtoToEntity(full.batchImage) : undefined,
    requiredValue: isFull ? full.requiredValue : undefined,
  };
}

export interface StrapiCompetitionResultResponse {
  id: number;
  documentId: string;
  order: number;
  totalPoints: number;
  competition?: { id: number; documentId: string };
  model?: StrapiCompetitionModelEntryResponse | { id: number; documentId: string };
  batch?: StrapiCompetitionBatchResponse | { id: number; documentId?: string } | null;
}

export function mapCompetitionResultDtoToEntity(
  dto: StrapiCompetitionResultResponse
): CompetitionResultEntity {
  return {
    id: dto.id,
    documentId: dto.documentId,
    order: dto.order ?? 0,
    totalPoints: dto.totalPoints ?? 0,
    competition: dto.competition
      ? { id: dto.competition.id, documentId: dto.competition.documentId }
      : undefined,
    model: dto.model
      ? 'model' in dto.model
        ? mapCompetitionModelEntryDtoToEntity(dto.model)
        : { id: dto.model.id, documentId: dto.model.documentId }
      : undefined,
    batch: dto.batch ? mapCompetitionBatchDtoToEntity(dto.batch) : null,
  };
}

export interface StrapiCompetitionEvaluationResponse {
  id: number;
  documentId: string;
  name: string;
  criteria?: StrapiCriteriaResponse | { id: number; documentId: string } | null;
  comments?: string;
  points: number;
  reviewer?: {
    id: number;
    documentId?: string;
    username?: string;
    user?: { id: number; username?: string };
  };
  result?: { id: number; documentId: string };
}

function mapCriteriaRelationToEntity(
  dto: StrapiCompetitionEvaluationResponse['criteria']
): CriteriaEntity | { id: number; documentId: string } | undefined {
  if (!dto) return undefined;
  const full = dto as StrapiCriteriaResponse;
  const isFull = typeof full.name === 'string';
  return isFull ? mapCriteriaDtoToEntity(full) : { id: full.id, documentId: full.documentId };
}

export function mapCompetitionEvaluationDtoToEntity(
  dto: StrapiCompetitionEvaluationResponse
): CompetitionEvaluationEntity {
  return {
    id: dto.id,
    documentId: dto.documentId,
    name: dto.name,
    criteria: mapCriteriaRelationToEntity(dto.criteria),
    comments: dto.comments ?? undefined,
    points: dto.points ?? 0,
    reviewer: dto.reviewer
      ? {
          id: dto.reviewer.id,
          documentId: dto.reviewer.documentId,
          username: dto.reviewer.user?.username ?? dto.reviewer.username,
        }
      : undefined,
    result: dto.result
      ? { id: dto.result.id, documentId: dto.result.documentId }
      : undefined,
  };
}
