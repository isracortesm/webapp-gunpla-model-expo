import { AuthResponseEntity, LoginRequestEntity } from '../../../domain/entities/auth/entity';

export interface AuthRepository {
  register(username: string, email: string, password: string): Promise<AuthResponseEntity>;
  login(identifier: string, password: string): Promise<AuthResponseEntity>;
}