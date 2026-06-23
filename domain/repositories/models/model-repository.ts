import { ModelEntity } from '@/domain/entities/models/model-entity';
import { PaginatedModelResult } from '@/domain/entities/models/paginated-model-result';

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

export interface ModelRepository {
  getModels(params?: GetModelsParams): Promise<PaginatedModelResult>;
  getModel(modelId: number): Promise<ModelEntity>;
  getModelByDocumentId(documentId: string): Promise<ModelEntity>;
  createModel(params: CreateModelParams): Promise<ModelEntity>;
  deleteModel(documentId: string, token?: string): Promise<void>;
}
