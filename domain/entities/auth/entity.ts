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