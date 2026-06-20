import { UserEntity, AuthResponseEntity, ResetPasswordRequestEntity } from '../../../domain/entities/auth/entity';

export interface AuthRepository {
  register(username: string, email: string, password: string): Promise<AuthResponseEntity>;
  login(identifier: string, password: string): Promise<AuthResponseEntity>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(request: ResetPasswordRequestEntity): Promise<AuthResponseEntity>;
  getCurrentUser(): Promise<UserEntity>;
}