import { RegisterUseCase } from '@/domain/usecases/auth/register-usecase';
import { LoginUseCase } from '@/domain/usecases/auth/login-usecase';
import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repository-impl';
import { HttpService } from '@/data/services/http-client';

const httpService = new HttpService();
const repository = new AuthRepositoryImpl(httpService);
const registerUseCase = new RegisterUseCase(repository);
const loginUseCase = new LoginUseCase(repository);

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