import { RegisterUseCase } from '@/domain/usecases/auth/register-usecase';
import { LoginUseCase } from '@/domain/usecases/auth/login-usecase';
import { ForgotPasswordUseCase } from '@/domain/usecases/auth/forgot-password-usecase';
import { ResetPasswordUseCase } from '@/domain/usecases/auth/reset-password-usecase';
import { ChangePasswordUseCase } from '@/domain/usecases/auth/change-password-usecase';
import { UpdateUserUseCase } from '@/domain/usecases/auth/update-user-usecase';
import { GetCurrentUserServiceCase } from '@/domain/usecases/auth/get-current-user-usecase';
import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repository-impl';
import { HttpService } from '@/data/services/http-client';
import type { UpdateUserParams } from '@/domain/entities/auth/entity';
import type { CreateSocialNetworkParams } from '@/domain/entities/social-networks/entity';

const httpService = new HttpService();
const repository = new AuthRepositoryImpl(httpService);

export class AuthService {
  private registerUseCase: RegisterUseCase;
  private loginUseCase: LoginUseCase;
  private forgotPasswordUseCase: ForgotPasswordUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;
  private changePasswordUseCase: ChangePasswordUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private getCurrentUserUseCase: GetCurrentUserServiceCase;

  constructor() {
    this.registerUseCase = new RegisterUseCase(repository);
    this.loginUseCase = new LoginUseCase(repository);
    this.forgotPasswordUseCase = new ForgotPasswordUseCase(repository);
    this.resetPasswordUseCase = new ResetPasswordUseCase(repository);
    this.changePasswordUseCase = new ChangePasswordUseCase(repository);
    this.updateUserUseCase = new UpdateUserUseCase(repository);
    this.getCurrentUserUseCase = new GetCurrentUserServiceCase(repository);
  }

  async registerUser(username: string, email: string, password: string) {
    return this.registerUseCase.execute(username, email, password);
  }

  async loginUser(identifier: string, password: string) {
    return this.loginUseCase.execute(identifier, password);
  }

  async forgotPasswordUser(email: string): Promise<void> {
    return this.forgotPasswordUseCase.execute(email);
  }

  async resetPasswordUser(password: string, passwordConfirmation: string, code: string) {
    return this.resetPasswordUseCase.execute({ password, passwordConfirmation, code });
  }

  async changeUserPassword(currentPassword: string, password: string, passwordConfirmation: string) {
    return this.changePasswordUseCase.execute(currentPassword, password, passwordConfirmation);
  }

  async updateCurrentUser(userId: number, params: UpdateUserParams, token?: string) {
    return this.updateUserUseCase.execute(userId, params, token);
  }

  async getCurrentUser() {
    return this.getCurrentUserUseCase.execute();
  }

  async createSocialNetwork(params: CreateSocialNetworkParams, token?: string) {
    return repository.createSocialNetwork(params, token);
  }

  async deleteSocialNetwork(documentId: string, token?: string): Promise<void> {
    return repository.deleteSocialNetwork(documentId, token);
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  const service = new AuthService();
  return service.registerUser(username, email, password);
}

export async function loginUser(identifier: string, password: string) {
  const service = new AuthService();
  return service.loginUser(identifier, password);
}

export async function forgotPasswordUser(email: string): Promise<void> {
  const service = new AuthService();
  return service.forgotPasswordUser(email);
}

export async function resetPasswordUser(
  password: string,
  passwordConfirmation: string,
  code: string,
) {
  const service = new AuthService();
  return service.resetPasswordUser(password, passwordConfirmation, code);
}

export async function changePassword(
  currentPassword: string,
  password: string,
  passwordConfirmation: string,
) {
  const service = new AuthService();
  return service.changeUserPassword(currentPassword, password, passwordConfirmation);
}

export async function updateCurrentUser(
  userId: number,
  params: UpdateUserParams,
  token?: string,
) {
  const service = new AuthService();
  return service.updateCurrentUser(userId, params, token);
}

export async function getCurrentUser() {
  const service = new AuthService();
  return service.getCurrentUser();
}

export async function createSocialNetwork(params: CreateSocialNetworkParams, token?: string) {
  const service = new AuthService();
  return service.createSocialNetwork(params, token);
}

export async function deleteSocialNetwork(documentId: string, token?: string): Promise<void> {
  const service = new AuthService();
  return service.deleteSocialNetwork(documentId, token);
}