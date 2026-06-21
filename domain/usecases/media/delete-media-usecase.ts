import { MediaRepository } from '@/domain/repositories/media/media-repository';

export class DeleteMediaUseCase {
  private repository: MediaRepository;

  constructor(repository: MediaRepository) {
    this.repository = repository;
  }

  async execute(id: string, token?: string): Promise<void> {
    await this.repository.deleteMedia(id, token);
  }
}