import { SocialNetworkRepository } from '@/domain/repositories/social-networks/social-network-repository';

export class DeleteSocialNetworkUseCase {
  private repository: SocialNetworkRepository;

  constructor(repository: SocialNetworkRepository) {
    this.repository = repository;
  }

  async execute(documentId: string): Promise<void> {
    await this.repository.deleteSocialNetwork(documentId);
  }
}