import { ModelRepository } from '@/domain/repositories/models/model-repository';
import { ModelEntity } from '@/domain/entities/models/model-entity';
import { CreateModelParams } from '@/domain/repositories/models/model-repository';

export class CreateModelUseCase {
  private repository: ModelRepository;

  constructor(repository: ModelRepository) {
    this.repository = repository;
  }

  async execute(params: CreateModelParams): Promise<ModelEntity> {
    return this.repository.createModel(params);
  }
}
