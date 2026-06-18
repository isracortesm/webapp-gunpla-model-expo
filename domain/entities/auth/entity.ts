export interface UserEntity {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
}

export interface AuthResponseEntity {
  jwt: string;
  user: UserEntity;
}

export interface LoginRequestEntity {
  identifier: string;
  password: string;
}