import { ModelRepository } from '@/domain/repositories/models/model-repository';

export class DeleteModelUseCase {
  private repository: ModelRepository;

  constructor(repository: ModelRepository) {
    this.repository = repository;
  }

  async execute(documentId: string): Promise<void> {
    await this.repository.deleteModel(documentId);
  }
}

