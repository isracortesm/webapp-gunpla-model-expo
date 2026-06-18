import { RegisterUseCase } from '@/domain/usecases/auth/register-usecase';
import { LoginUseCase } from '@/domain/usecases/auth/login-usecase';
import { ForgotPasswordUseCase } from '@/domain/usecases/auth/forgot-password-usecase';
import { ResetPasswordUseCase } from '@/domain/usecases/auth/reset-password-usecase';
import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repository-impl';
import { HttpService } from '@/data/services/http-client';

const httpService = new HttpService();
const repository = new AuthRepositoryImpl(httpService);
const registerUseCase = new RegisterUseCase(repository);
const loginUseCase = new LoginUseCase(repository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(repository);
const resetPasswordUseCase = new ResetPasswordUseCase(repository);

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  return registerUseCase.execute(username, email, password);
}

export async function loginUser(identifier: string, password: string) {
  return loginUseCase.execute(identifier, password);
}

export async function forgotPasswordUser(email: string): Promise<void> {
  return forgotPasswordUseCase.execute(email);
}

export async function resetPasswordUser(
  password: string,
  passwordConfirmation: string,
  code: string,
) {
  return resetPasswordUseCase.execute({ password, passwordConfirmation, code });
}