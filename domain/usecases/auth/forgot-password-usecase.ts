import { AuthRepository } from '@/domain/repositories/auth/auth-repository';

export class ForgotPasswordUseCase {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(email: string): Promise<void> {
    return this.repository.forgotPassword(email);
  }
}