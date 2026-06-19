import { RegisterUseCase } from '@/domain/usecases/auth/register-usecase';
import { LoginUseCase } from '@/domain/usecases/auth/login-usecase';
import { ForgotPasswordUseCase } from '@/domain/usecases/auth/forgot-password-usecase';
import { ResetPasswordUseCase } from '@/domain/usecases/auth/reset-password-usecase';
import { GetCurrentUserServiceCase } from '@/domain/usecases/auth/get-current-user-usecase';
import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repository-impl';
import { HttpService } from '@/data/services/http-client';

const httpService = new HttpService();
const repository = new AuthRepositoryImpl(httpService);
const registerUseCase = new RegisterUseCase(repository);
const loginUseCase = new LoginUseCase(repository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(repository);
const resetPasswordUseCase = new ResetPasswordUseCase(repository);
const getCurrentUserUseCase = new GetCurrentUserServiceCase(repository);

export class AuthService {
  private registerUseCase: RegisterUseCase;
  private loginUseCase: LoginUseCase;
  private forgotPasswordUseCase: ForgotPasswordUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;
  private getCurrentUserUseCase: GetCurrentUserServiceCase;

  constructor() {
    this.registerUseCase = new RegisterUseCase(repository);
    this.loginUseCase = new LoginUseCase(repository);
    this.forgotPasswordUseCase = new ForgotPasswordUseCase(repository);
    this.resetPasswordUseCase = new ResetPasswordUseCase(repository);
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

  async getCurrentUser() {
    return this.getCurrentUserUseCase.execute();
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

export async function getCurrentUser() {
  const service = new AuthService();
  return service.getCurrentUser();
}