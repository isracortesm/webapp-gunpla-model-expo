import { ModelEntity } from '@/domain/entities/models/model-entity';
import { PaginatedModelResult } from '@/domain/entities/models/paginated-model-result';
import { CreateModelReferenceParams, ModelReferenceResponseEntity } from '@/domain/entities/model-references/entity';

export interface GetModelsParams {
  page?: number;
  pageSize?: number;
  userId?: number;
}

export interface CreateModelParams {
  name: string;
  description: string;
  userId: number;
  imageId?: number;
  token?: string;
  references?: {
    type: string;
    name: string;
    url: string;
  }[];
}

export interface UpdateModelParams {
  name: string;
  description: string;
  userId: number;
  imageId?: number;
  token?: string;
  references?: {
    type: string;
    name: string;
    url: string;
  }[];
}

export interface ModelRepository {
  getModels(params?: GetModelsParams): Promise<PaginatedModelResult>;
  getModel(modelId: number): Promise<ModelEntity>;
  getModelByDocumentId(documentId: string): Promise<ModelEntity>;
  createModel(params: CreateModelParams): Promise<ModelEntity>;
  updateModel(documentId: string, params: UpdateModelParams): Promise<ModelEntity>;
  deleteModel(documentId: string, token?: string): Promise<void>;
  createSocialNetwork(params: {
    type: string;
    name: string;
    url: string;
    userId: number;
  }): Promise<{ data: any }>;
  createModelReference(params: CreateModelReferenceParams, token?: string): Promise<ModelReferenceResponseEntity>;
  deleteModelReference(documentId: string, token?: string): Promise<void>;
}

