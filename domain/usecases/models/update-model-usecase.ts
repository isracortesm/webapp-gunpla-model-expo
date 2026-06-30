import { ModelRepository, UpdateModelParams } from '@/domain/repositories/models/model-repository';
import { ModelEntity } from '@/domain/entities/models/model-entity';

export class UpdateModelUseCase {
  private repository: ModelRepository;

  constructor(repository: ModelRepository) {
    this.repository = repository;
  }

  async execute(documentId: string, params: UpdateModelParams): Promise<ModelEntity> {
    return this.repository.updateModel(documentId, params);
  }
}
