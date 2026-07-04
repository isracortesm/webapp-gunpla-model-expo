import { SocialNetworkRepository } from '@/domain/repositories/social-networks/social-network-repository';
import { CreateSocialNetworkParams, SocialNetworkResponseEntity } from '@/domain/entities/social-networks/entity';

export class CreateSocialNetworkUseCase {
  private repository: SocialNetworkRepository;

  constructor(repository: SocialNetworkRepository) {
    this.repository = repository;
  }

  async execute(params: CreateSocialNetworkParams): Promise<SocialNetworkResponseEntity> {
    return this.repository.createSocialNetwork(params);
  }
}