import { ModelEntity } from '@/domain/entities/models/model-entity';

export interface GetModelsParams {
  page?: number;
  pageSize?: number;
  userId?: number;
}

export interface ModelRepository {
  getModels(params?: GetModelsParams): Promise<ModelEntity[]>;
}
