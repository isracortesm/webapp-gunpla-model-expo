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

export interface CompetitionModelEntryEntity {
  id: number;
  documentId: string;
  model: ModelEntity;
}
