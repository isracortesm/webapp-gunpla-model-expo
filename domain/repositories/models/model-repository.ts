import { ModelEntity } from '@/domain/entities/models/model-entity';
import { PaginatedModelResult } from '@/domain/entities/models/paginated-model-result';

export interface GetModelsParams {
  page?: number;
  pageSize?: number;
  userId?: number;
}
export interface ModelRepository {
  getModels(params?: GetModelsParams): Promise<PaginatedModelResult>;
}
