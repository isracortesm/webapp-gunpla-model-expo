import { ModelRepository } from '@/domain/repositories/models/model-repository';
import { ModelEntity } from '@/domain/entities/models/model-entity';

export class GetModelByDocumentIdUseCase {
  private repository: ModelRepository;

  constructor(repository: ModelRepository) {
    this.repository = repository;
  }

  async execute(documentId: string): Promise<ModelEntity> {
    return this.repository.getModelByDocumentId(documentId);
  }
}
