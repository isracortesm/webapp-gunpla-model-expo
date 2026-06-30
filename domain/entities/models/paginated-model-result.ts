import { ModelEntity } from '@/domain/entities/models/model-entity';
import { Pagination } from '../common/pagination-entity';

export interface PaginatedModelResult {
  data: ModelEntity[];
  meta: {
    pagination: Pagination;
  };
}
