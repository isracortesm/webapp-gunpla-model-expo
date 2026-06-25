import { UserEntity, AuthResponseEntity, ResetPasswordRequestEntity, UpdateUserParams } from '../../../domain/entities/auth/entity';

export interface AuthRepository {
  register(username: string, email: string, password: string): Promise<AuthResponseEntity>;
  login(identifier: string, password: string): Promise<AuthResponseEntity>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(request: ResetPasswordRequestEntity): Promise<AuthResponseEntity>;
  changePassword(currentPassword: string, password: string, passwordConfirmation: string): Promise<AuthResponseEntity>;
  updateUser(userId: number, params: UpdateUserParams, token?: string): Promise<UserEntity>;
  getCurrentUser(): Promise<UserEntity>;
}