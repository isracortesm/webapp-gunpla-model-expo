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
}

export interface CompetitionModelEntity {
  id: string;
  documentId: string;
}

import { ModelEntity } from '../models/model-entity';
import { PopulatedUser } from '../event-dashboard/entity';

export interface CompetitionModelEntryEntity {
  id: number;
  documentId: string;
  model: ModelEntity;
  user?: PopulatedUser;
}

export interface CompetitionResultEntity {
  id: number;
  documentId: string;
  order: number;
  totalPoints: number;
  competition?: { id: number; documentId: string };
  model?: { id: number; documentId: string };
  batch?: { id: number; documentId?: string } | null;
}

export interface CompetitionEvaluationEntity {
  id: number;
  documentId: string;
  criteria: string;
  comments?: string;
  points: number;
  reviewer?: { id: number; documentId?: string };
  result?: { id: number; documentId: string };
}
