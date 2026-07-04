import { ModelReferenceRepository } from '@/domain/repositories/model-references/model-reference-repository';

export class DeleteModelReferenceUseCase {
  private repository: ModelReferenceRepository;

  constructor(repository: ModelReferenceRepository) {
    this.repository = repository;
  }

  async execute(documentId: string, token?: string): Promise<void> {
    await this.repository.deleteModelReference(documentId, token);
  }
}
