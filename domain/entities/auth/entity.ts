import type { MediaEntity, SocialNetworkItem } from '../event-dashboard/entity';

export interface UserEntity {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider: string;
  aboutMe?: string;
  profileImage?: MediaEntity | null;
  confirmed: boolean;
  blocked: boolean;
  socialNetworks?: SocialNetworkItem[];
}

export interface AuthResponseEntity {
  jwt: string;
  user: UserEntity;
}

export interface LoginRequestEntity {
  identifier: string;
  password: string;
}

export interface ResetPasswordRequestEntity {
  password: string;
  passwordConfirmation: string;
  code: string;
}

export interface ChangePasswordRequestEntity {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateUserParams {
  username?: string;
  aboutMe?: string;
  socialNetworks?: {
    type: string;
    name: string;
    url: string;
  }[];
  profileImage?: number;
}