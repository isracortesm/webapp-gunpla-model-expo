import { ModelEntity } from '@/domain/entities/models/model-entity';
import { Pagination } from './pagination-entity';

export interface PaginatedModelResult {
  data: ModelEntity[];
  meta: {
    pagination: Pagination;
  };
}
