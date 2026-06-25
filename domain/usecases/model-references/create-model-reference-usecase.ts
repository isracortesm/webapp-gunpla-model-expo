import { ModelReferenceRepository } from '@/domain/repositories/model-references/model-reference-repository';
import { CreateModelReferenceParams, ModelReferenceResponseEntity } from '@/domain/entities/model-references/entity';

export class CreateModelReferenceUseCase {
  private repository: ModelReferenceRepository;

  constructor(repository: ModelReferenceRepository) {
    this.repository = repository;
  }

  async execute(params: CreateModelReferenceParams, token?: string): Promise<ModelReferenceResponseEntity> {
    return this.repository.createModelReference(params, token);
  }
}
