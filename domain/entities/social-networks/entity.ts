export interface SocialNetworkEntity {
  id: number;
  documentId?: string;
  type: string;
  name: string;
  url: string;
}

export interface CreateSocialNetworkParams {
  type: string;
  name: string;
  url: string;
  userId: number;
}

export interface SocialNetworkResponseEntity {
  data: SocialNetworkEntity;
  meta?: Record<string, unknown>;
}