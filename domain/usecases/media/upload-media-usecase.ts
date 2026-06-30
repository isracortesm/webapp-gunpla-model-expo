import { MediaRepository } from '@/domain/repositories/media/media-repository';
import { ImageEntity } from '@/domain/entities/models/model-entity';

export class UploadMediaUseCase {
  private repository: MediaRepository;

  constructor(repository: MediaRepository) {
    this.repository = repository;
  }

  async execute(file: File, token?: string, fileInfo?: { ref?: string; refId?: number; field?: string }): Promise<ImageEntity[]> {
    return this.repository.uploadMedia(file, token, fileInfo);
  }
}