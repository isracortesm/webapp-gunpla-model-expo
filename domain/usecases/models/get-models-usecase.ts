import { ModelRepository } from '@/domain/repositories/models/model-repository';
import { PaginatedModelResult } from '@/domain/entities/models/paginated-model-result';

export class GetModelsUseCase {
  private repository: ModelRepository;

  constructor(repository: ModelRepository) {
    this.repository = repository;
  }

  async execute(params?: { page?: number; pageSize?: number, userId?: number }): Promise<PaginatedModelResult> {
    return this.repository.getModels(params);
  }
}
