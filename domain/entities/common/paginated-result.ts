import { Pagination } from './pagination-entity';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    pagination: Pagination;
  };
}
