import { AuthResponseEntity, ResetPasswordRequestEntity } from '@/domain/entities/auth/entity';
import { AuthRepository } from '@/domain/repositories/auth/auth-repository';

export class ResetPasswordUseCase {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(request: ResetPasswordRequestEntity): Promise<AuthResponseEntity> {
    return this.repository.resetPassword(request);
  }
}