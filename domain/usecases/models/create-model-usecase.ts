import { ModelRepository } from '@/domain/repositories/models/model-repository';
import { ModelEntity } from '@/domain/entities/models/model-entity';

export interface CreateModelParams {
  name: string;
  description: string;
  userId: number;
  imageId?: number;
  references?: {
    type: string;
    name: string;
    url: string;
  }[];
}

export class CreateModelUseCase {
  private repository: ModelRepository;

  constructor(repository: ModelRepository) {
    this.repository = repository;
  }

  async execute(params: CreateModelParams): Promise<ModelEntity> {
    return this.repository.createModel(params);
  }
}
