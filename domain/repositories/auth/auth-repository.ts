import { AuthResponseEntity } from '../../../domain/entities/auth/entity';

export interface AuthRepository {
  register(username: string, email: string, password: string): Promise<AuthResponseEntity>;
}