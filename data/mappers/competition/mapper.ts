import {
  CompetitionEntity,
  CompetitionCategoryEntity,
  CriteriaEntity,
} from '../../../domain/entities/competition/entity';

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
  };
}
