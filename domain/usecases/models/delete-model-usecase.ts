import { ModelRepository } from '@/domain/repositories/models/model-repository';
import { MediaRepository } from '@/domain/repositories/media/media-repository';

export class DeleteModelUseCase {
  private repository: ModelRepository;
  private mediaRepository: MediaRepository;

  constructor(repository: ModelRepository, mediaRepository: MediaRepository) {
    this.repository = repository;
    this.mediaRepository = mediaRepository;
  }

  async execute(params: {
    documentId: string;
    imageId?: number;
    token?: string;
  }): Promise<void> {
    await this.repository.deleteModel(params.documentId, params.token);

    if (params.imageId) {
      await this.mediaRepository.deleteMedia(params.imageId, params.token);
    }
  }
}
