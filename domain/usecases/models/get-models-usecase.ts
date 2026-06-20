import { ModelEntity } from '@/domain/entities/models/model-entity';
import { ModelRepository } from '@/domain/repositories/models/model-repository';

export class GetModelsUseCase {
  private repository: ModelRepository;

  constructor(repository: ModelRepository) {
    this.repository = repository;
  }

  async execute(params?: { page?: number; pageSize?: number }): Promise<ModelEntity[]> {
    return this.repository.getModels(params);
  }
}
