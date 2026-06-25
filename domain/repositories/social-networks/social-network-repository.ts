import { CreateSocialNetworkParams, SocialNetworkResponseEntity } from '@/domain/entities/social-networks/entity';

export interface SocialNetworkRepository {
  createSocialNetwork(params: CreateSocialNetworkParams): Promise<SocialNetworkResponseEntity>;
  deleteSocialNetwork(documentId: string): Promise<void>;
}