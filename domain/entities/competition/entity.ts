export interface CriteriaEntity {
  id: number;
  documentId: string;
  name: string;
  description: string;
  maxPoints: number;
  codeName: string;
}

export interface CompetitionCategoryEntity {
  id: number;
  documentId: string;
  name: string;
  description: string;
  criterias: CriteriaEntity[];
}

export interface CompetitionEntity {
  id: number;
  documentId: string;
  type: string;
  hasPublicResults: boolean;
  modelsLimit: number;
  categories: CompetitionCategoryEntity[];
  batchLimits?: CompetitionBatchLimitEntity[];
}

export interface CompetitionBatchLimitEntity {
  id: number;
  limit: number;
  assigned: number;
  batch?: CompetitionBatchEntity | { id: number; documentId: string } | null;
}

export interface CompetitionModelEntity {
  id: string;
  documentId: string;
}

import { ImageEntity, ModelEntity } from '../models/model-entity';
import { PopulatedUser } from '../event-dashboard/entity';

export interface CompetitionModelEntryEntity {
  id: number;
  documentId: string;
  model: ModelEntity;
  user?: PopulatedUser;
  category?: CompetitionCategoryEntity;
}

export interface CompetitionBatchEntity {
  id: number;
  documentId: string;
  batch: string;
  batchName: string;
  batchImage?: ImageEntity | null;
  requiredValue?: number;
}

export interface CompetitionResultEntity {
  id: number;
  documentId: string;
  order: number;
  totalPoints: number;
  competition?: { id: number; documentId: string };
  model?: CompetitionModelEntryEntity | { id: number; documentId: string };
  batch?: CompetitionBatchEntity | null;
}

export interface CompetitionEvaluationEntity {
  id: number;
  documentId: string;
  name: string;
  criteria?: CriteriaEntity | { id: number; documentId: string } | null;
  comments?: string;
  points: number;
  reviewer?: { id: number; documentId?: string; username?: string };
  result?: { id: number; documentId: string };
}
